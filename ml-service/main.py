import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
import json
import cv2

from PIL import Image, ImageOps
from io import BytesIO
from pathlib import Path
from threading import Lock

# 1. Create FastAPI application
app = FastAPI(title="Garden Lens Recognition API")

# 2. Configure CORS for development and production
IS_DEVELOPMENT = os.getenv(
    "APP_ENV", "development"
) == "development"

allowed_origins = [
    "https://gardenlens.netlify.app"
]

if IS_DEVELOPMENT:
    allowed_origins.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ])

# Allow private Wi-Fi network addresses during development
local_origin_regex = (
    r"^http://"
    r"(192\.168\.\d{1,3}\.\d{1,3}"
    r"|10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    r"|172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3})"
    r":5173$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=(
        local_origin_regex if IS_DEVELOPMENT else None
    ),
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)
# 3. Locate the model files
BASE_DIR = Path(__file__).resolve().parent

# 4. Load trained V2 model
interpreter = tf.lite.Interpreter(
    model_path=str(
        BASE_DIR / "models" / "garden_lens_model_v2.tflite"
    )
)

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

model_lock = Lock()

# 5. Load class names
with open(BASE_DIR / "models" / "class_names.json") as f:
    class_names = json.load(f)

# 6. Temporary confidence threshold
CONFIDENCE_THRESHOLD = 0.60
BLUR_THRESHOLD = 50.0


# 7. Check whether the API is working
@app.get("/")
@app.get("/health")
def health():
    return {
        "message": "Garden Lens API is working",
        "model_version": "v2"
    }

def calculate_blur_score(image):

    # Standardise image size for more consistent testing
    image = image.copy()
    image.thumbnail((640, 640))

    # Convert PIL image into a NumPy array
    image_array = np.array(image)

    # Convert RGB image to grayscale
    gray = cv2.cvtColor(
        image_array,
        cv2.COLOR_RGB2GRAY
    )

    # Calculate image sharpness
    blur_score = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    return float(blur_score)
# 8. Image recognition endpoint
@app.post("/predict")
def predict(file: UploadFile = File(...)):

    # Receive uploaded image
    contents = file.file.read(10 * 1024 * 1024 + 1)

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image is too large"
        )

    try:
        # Open and preprocess image
        image = Image.open(BytesIO(contents))

        image = ImageOps.exif_transpose(image)

        image = image.convert("RGB")
          # Check image quality before recognition
        blur_score = calculate_blur_score(image)

        if blur_score < BLUR_THRESHOLD:
            return {
                "status": "blurry",
                "blur_score": blur_score,
                "best_prediction": None,
                "top3": [],
                "model_version": "v2"
            }

        image = image.resize(
            (224, 224),
            Image.Resampling.BILINEAR
        )

        image_array = np.array(
            image,
            dtype=np.float32
        )

        image_array = np.expand_dims(
            image_array,
            axis=0
        )

    except (OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file"
        )

    # 9. Perform image recognition
    with model_lock:
        interpreter.set_tensor(
            input_details[0]["index"],
            image_array
        )

        interpreter.invoke()

        predictions = interpreter.get_tensor(
            output_details[0]["index"]
        )[0]

    # 10. Find top three predictions
    top3_indices = np.argsort(predictions)[-3:][::-1]

    top3 = []

    for index in top3_indices:
        top3.append({
            "class_name": class_names[index],
            "confidence": float(predictions[index])
        })

    # 11. Select the highest confidence prediction
    best_prediction = top3[0]

    # 12. Check whether the model is confident
    status = "ok"

    if (
        best_prediction["confidence"] < CONFIDENCE_THRESHOLD
        or best_prediction["class_name"] == "Others"
    ):
        status = "not_sure"

    # 13. Return results to frontend
    return {
        "status": status,
        "best_prediction": best_prediction,
        "top3": top3,
        "blur_score": blur_score,
        "model_version": "v2"
    }