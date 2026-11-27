
import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImage from "../utils/cropImage";
import "../styles/ImageCropper.css";

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  const [error, setError] = useState("");

  async function handleConfirmCrop() {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImage(
        image,
        croppedAreaPixels
      );

      onCropComplete(croppedImage);
    } catch (error) {
      setError("Unable to crop image. Please try again.");
    }
  }

  function handleReset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-panel">

        <h2>Crop & Adjust</h2>

        <p>
          Position the plant or landmark inside the frame.
        </p>

        <div className="image-cropper-area">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            minZoom={1}
            maxZoom={4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) =>
              setCroppedAreaPixels(pixels)
            }
          />
        </div>

        <div className="crop-zoom-control">
          <label htmlFor="crop-zoom">Zoom</label>

          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={4}
            step={0.1}
            value={zoom}
            onChange={(e) =>
              setZoom(Number(e.target.value))
            }
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <div className="crop-action-buttons">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="button" onClick={handleReset}>
            Reset
          </button>

          <button
            type="button"
            className="confirm-crop-button"
            onClick={handleConfirmCrop}
            disabled={!croppedAreaPixels}
          >
            Confirm Crop
          </button>
        </div>

      </div>
    </div>
  );
}
