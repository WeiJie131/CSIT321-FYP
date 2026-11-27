import tensorflow as tf
import numpy as np
import json
from PIL import Image, ImageOps
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# 1. Load the trained V2 model
interpreter = tf.lite.Interpreter(
    model_path=str(
        BASE_DIR / "models" / "garden_lens_model_v2.tflite"
    )
)

interpreter.allocate_tensors()

# 2. Load class names
with open(BASE_DIR / "models" / "class_names.json") as f:
    class_names = json.load(f)

# 3. Get model input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# 4. Open the test photograph
image = Image.open(
    BASE_DIR / "test_images" / "frangipani.jpg"
)

# Correct photograph orientation
image = ImageOps.exif_transpose(image)

# 5. Preprocess the image
image = image.convert("RGB")
image = image.resize((224, 224), Image.Resampling.BILINEAR)

image_array = np.array(image, dtype=np.float32)

# Add batch dimension
image_array = np.expand_dims(image_array, axis=0)

# 6. Send the image to the trained model
interpreter.set_tensor(
    input_details[0]["index"],
    image_array
)

# 7. Perform prediction
interpreter.invoke()

predictions = interpreter.get_tensor(
    output_details[0]["index"]
)[0]

# 8. Find the highest confidence prediction
best_index = np.argmax(predictions)

class_name = class_names[best_index]
confidence = predictions[best_index] * 100

# 9. Display final recognition result
print("\n--- Recognition Result ---")
print("Predicted class:", class_name)
print(f"Confidence: {confidence:.2f}%")