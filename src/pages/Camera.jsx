
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Camera as CameraIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Start the camera when entering the page
  useEffect(() => {
    if (capturedImage) return;

    let cancelled = false;

    async function startCamera() {
      setCameraError("");
      setCameraReady(false);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Camera access requires a secure HTTPS connection."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
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
            "Camera permission denied. Please allow camera access."
          );
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera was detected.");
        } else {
          setCameraError(
            error.message || "Unable to access the camera."
          );
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
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

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

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(imageData);
    setCameraReady(false);

    stopCamera();
  }

  // Retake a photograph
  function retakePhoto() {
    setCameraReady(false);
    setCapturedImage(null);
    setCameraError("");
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

      setCapturedImage(reader.result);
      setCameraReady(false);
      setCameraError("");
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
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
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
              onClick={() =>
                setCameraAttempt((attempt) => attempt + 1)
              }
            >
              Try Again
            </button>

            <p>You can still upload an image from your gallery.</p>
          </div>
        )}

        {/* Camera loading message */}
        {!capturedImage && !cameraReady && !cameraError && (
          <div className="camera-loading">
            Opening camera...
          </div>
        )}

        {/* Camera focus frame */}
        {!capturedImage && cameraReady && (
          <div className="focus-frame">
            <span className="focus-top-left" />
            <span className="focus-top-right" />
            <span className="focus-bottom-left" />
            <span className="focus-bottom-right" />
          </div>
        )}

        <canvas ref={canvasRef} hidden />

      </main>

      {/* Bottom camera controls */}
      <footer className="camera-controls">

        <div className="camera-control-placeholder" />

        {/* Capture or retake button */}
        <div className="shutter-container">
          <button
            type="button"
            className="shutter-button"
            onClick={
              capturedImage ? retakePhoto : capturePhoto
            }
            disabled={!capturedImage && !cameraReady}
            aria-label={
              capturedImage ? "Retake photo" : "Capture photo"
            }
          >
            <span className="shutter-inner" />
          </button>

          {capturedImage && (
            <span className="retake-label">
              Retake
            </span>
          )}
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
