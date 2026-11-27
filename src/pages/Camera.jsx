import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Camera as CameraIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ML_API_URL } from "../config/api";
import ImageCropper from "../components/ImageCropper";

import "../styles/Camera.css";

function Camera() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [showCropper, setShowCropper] = useState(false);

  const [predictions, setPredictions] = useState([]);
  const [isRecognising, setIsRecognising] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");

  // Start the camera when entering the page
  useEffect(() => {
    if (capturedImage) return;

    let cancelled = false;

    async function startCamera() {
      setCameraError("");
      setCameraReady(false);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access requires a secure HTTPS connection.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          if (!cancelled) {
            setCameraReady(true);
          }
        }
      } catch (error) {
        if (cancelled) return;

        stopCamera();

        console.error("Camera error:", error);

        if (error.name === "NotAllowedError") {
          setCameraError(
            "Camera permission denied. Please allow camera access.",
          );
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera was detected.");
        } else {
          setCameraError(error.message || "Unable to access the camera.");
        }
      }
    }

    startCamera();

    // Release the camera when leaving the page
    // or after capturing an image
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [capturedImage, cameraAttempt]);

  // Stop all active camera tracks
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }
  }

  // Capture a photograph
  function capturePhoto() {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (
    !video ||
    !canvas ||
    !cameraReady ||
    !video.videoWidth ||
    !video.videoHeight
  ) {
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) return;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.95);

  setCapturedImage(imageData);
  setShowCropper(true);
  setPredictions([]);
  setRecognitionError("");

  setCameraReady(false);

  stopCamera();
}

  // Retake a photograph
  function retakePhoto() {
    setCameraReady(false);
    setCapturedImage(null);
    setCameraError("");

    // Clear previous recognition results
    setPredictions([]);
    setRecognitionError("");
  }
  // Open the phone gallery
  function openGallery() {
    fileInputRef.current?.click();
  }

  // Handle the uploaded image
  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
const reader = new FileReader();

  reader.onload = () => {
    stopCamera();
    setCameraReady(false);
    setCapturedImage(reader.result);
    setShowCropper(true);
    setPredictions([]);
    setRecognitionError("");

    console.log("Gallery image loaded - opening cropper");
  };

  reader.onerror = () => {
    alert("Unable to read the selected image.");
  };

  reader.readAsDataURL(file);
}
   

    

  // Return to the homepage
  function goBack() {
    stopCamera();
    navigate("/");
  }
  async function recogniseImage() {
    if (!capturedImage) return;

    setIsRecognising(true);
    setRecognitionError("");
    setPredictions([]);

    try {
      // Convert the captured image into a Blob
      const imageResponse = await fetch(capturedImage);
      const imageBlob = await imageResponse.blob();

      // Prepare the image for FastAPI
      const formData = new FormData();

      formData.append("file", imageBlob, "photo.jpg");

      // Check ML service configuration
      if (!ML_API_URL) {
        throw new Error("ML service URL is not configured.");
      }

      // Send image to the ML service
      const response = await fetch(
        `${ML_API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error("Image recognition failed.");
      }

      const result = await response.json();

      console.log(result);

      if (result.status === "blurry") {
        setRecognitionError("Photo is blurry. Please retake it.");
      } else if (result.status === "not_sure") {
        setRecognitionError("Unable to confidently identify this object.");
      } else {
        setPredictions(result.top3);
      }
    } catch (error) {
      setRecognitionError(error.message);
    } finally {
      setIsRecognising(false);
    }
  }
  // Select the highest confidence prediction
  const bestPrediction =
    predictions.length > 0
      ? predictions.reduce((best, current) =>
        current.confidence > best.confidence ? current : best,
      )
      : null;
  const displayNames = {
    "Z1.1_Tanglin_Gate": "Tanglin Gate",
    "Z1.2_Tembusu_Tree": "Tembusu Tree",
    "Z1.3_Holttum_Hall": "Holttum Hall",
    "Z1.4_Frangipani": "Frangipani",
    "Z1.5_Couroupita_Guianensis": "Cannonball Tree",
    "Z1.6_Vanda_Miss_Joaquim": "Vanda Miss Joaquim",
    Others: "Unrecognised Object",
  };
  return (
    <div className="camera-page">
      {/* Top navigation bar */}
      <header className="camera-header">
        <button
          type="button"
          className="camera-back-button"
          onClick={goBack}
          aria-label="Return to homepage"
        >
          <ArrowLeft size={28} />
        </button>
      </header>

      {/* Camera preview */}
      <main className="camera-preview">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured or uploaded photograph"
            className="captured-image"
          />
        ) : (
          <div className="camera-preview-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-live-video"
            />

            {/* Camera guidance overlay */}
            <div className="camera-guide-overlay">
              <div className="camera-guide-frame">
                <span className="guide-corner top-left"></span>
                <span className="guide-corner top-right"></span>
                <span className="guide-corner bottom-left"></span>
                <span className="guide-corner bottom-right"></span>
              </div>

              <p className="camera-guide-text">
                Position the plant or landmark inside the frame
              </p>
            </div>
          </div>
        )}

        {/* Camera error message */}
        {!capturedImage && cameraError && (
          <div className="camera-error">
            <CameraIcon size={48} />

            <h2>Camera Unavailable</h2>

            <p>{cameraError}</p>

            <button
              type="button"
              className="camera-retry-button"
              onClick={() => setCameraAttempt((attempt) => attempt + 1)}
            >
              Try Again
            </button>

            <p>You can still upload an image from your gallery.</p>
          </div>
        )}

        {/* Camera loading message */}
        {!capturedImage && !cameraReady && !cameraError && (
          <div className="camera-loading">Opening camera...</div>
        )}

        {/* Camera focus frame */}


        <canvas ref={canvasRef} hidden />
      </main>
   
{/* Crop & Adjust button */}
{capturedImage && !showCropper && !isRecognising && (
  <button
    type="button"
    className="crop-adjust-button"
    onClick={() => setShowCropper(true)}
  >
    Crop & Adjust
  </button>
)}

{/* Recognise Image button */}
{capturedImage && !bestPrediction && !showCropper && (
  <button
    type="button"
    className="recognise-button"
    onClick={recogniseImage}
    disabled={isRecognising}
  >
    {isRecognising
      ? "Recognising..."
      : "Recognise Image"}
  </button>
)}
      {recognitionError && <p>{recognitionError}</p>}
      {showCropper && capturedImage && (
  <ImageCropper
    image={capturedImage}
    onCropComplete={(croppedImage) => {
      setCapturedImage(croppedImage);
      setShowCropper(false);
      setPredictions([]);
      setRecognitionError("");
    }}
    onCancel={() => {
      setShowCropper(false);
    }}
  />
)}
      {bestPrediction && (
        <div className="recognition-result-card">
          <p className="result-label">Recognised Image</p>

          <h2 className="result-name">
            {displayNames[bestPrediction.class_name] ||
              bestPrediction.class_name}
          </h2>

          <div className="match-score-row">
            <span>Match score</span>
            <strong>
              {(bestPrediction.confidence * 100).toFixed(1)}%
            </strong>
          </div>

          <div className="match-progress">
            <div
              className="match-progress-fill"
              style={{
                width: `${bestPrediction.confidence * 100}%`
              }}
            />
          </div>

          <p className="result-note">
            AI-suggested identification
          </p>
        </div>
      )}
      {/* Bottom camera controls */}
      <footer className="camera-controls">
        <div className="camera-control-placeholder" />

        {/* Capture or retake button */}
        <div className="shutter-container">
          <button
            type="button"
            className="shutter-button"
            onClick={capturedImage ? retakePhoto : capturePhoto}
            disabled={isRecognising || (!capturedImage && !cameraReady)}
            aria-label={capturedImage ? "Retake photo" : "Capture photo"}
          >
            <span className="shutter-inner" />
          </button>

          {capturedImage && <span className="retake-label">Retake</span>}
        </div>

        {/* Upload image button */}
        <button
          type="button"
          className="gallery-button"
          onClick={openGallery}
          aria-label="Upload image from gallery"
        >
          <ImagePlus size={26} />

          <span>Upload</span>
        </button>

        {/* Hidden image file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </footer>
    </div>
  );
}

export default Camera;
