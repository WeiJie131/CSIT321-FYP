import tensorflow as tf
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Load trained model
interpreter = tf.lite.Interpreter(
    model_path=str(
        BASE_DIR / "models" / "garden_lens_model_v2.tflite"
    )
)

interpreter.allocate_tensors()

# Load class names
with open(BASE_DIR / "models" / "class_names.json") as f:
    class_names = json.load(f)

print("Model loaded successfully!")
print("Classes:", class_names)

print("Input details:")
print(interpreter.get_input_details())

print("Output details:")
print(interpreter.get_output_details())