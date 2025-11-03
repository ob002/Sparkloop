import React, { useRef, useState, useEffect } from 'react';
import { Camera, Loader, CheckCircle, XCircle } from 'lucide-react';

const SelfieCapture = ({ onCapture, profilePhotoURL }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    setCapturing(true);

    // Create canvas and capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    // Stop camera
    stopCamera();

    // Send to parent
    onCapture(imageData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Camera View */}
        <div className="relative bg-gray-900 aspect-video">
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Overlay Guide */}
          {cameraReady && !capturing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-white/50 rounded-full w-64 h-64"></div>
            </div>
          )}

          {/* Reference Photo */}
          {profilePhotoURL && cameraReady && (
            <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-lg">
              <img
                src={profilePhotoURL}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <p className="text-xs text-center mt-1 text-gray-600">Match this</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Take a selfie to verify your identity
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Position your face in the circle</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Make sure your face is well-lit</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Match your profile photo expression</span>
            </li>
          </ul>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={capturePhoto}
            disabled={!cameraReady || capturing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {capturing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Capture Selfie
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfieCapture ;