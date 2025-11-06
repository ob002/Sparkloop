import React, { useRef, useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, Camera } from 'lucide-react';

const SelfieCapture = ({ onCapture, profilePhotoURL }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    // Check for existence of navigator.mediaDevices before calling startCamera
    if (navigator.mediaDevices) {
        startCamera();
    } else {
        setError('Camera access is not supported or allowed in this environment.');
    }
    
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
        // Only set camera ready after metadata loads
        videoRef.current.onloadedmetadata = () => { 
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions or if another app is using it.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    // Only reset cameraReady if no error occurred during initial load
    if (!error) {
        setCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReady) return;

    setCapturing(true);

    // Create canvas and capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    
    // CRITICAL FIX: Flip the image horizontally on the canvas 
    // to counteract the mirror effect applied to the video preview.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    // Stop camera and send to parent
    stopCamera();
    onCapture(imageData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Camera View */}
        <div className="relative bg-gray-900 aspect-video">
          {(!cameraReady && !error) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
          )}
          {error && (
             <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-white text-center text-lg">{error}</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            // CRITICAL FIX: The transform scaleX(-1) is essential for a standard user-facing camera preview
            style={{ transform: 'scaleX(-1)' }} 
            className="w-full h-full object-cover"
          />

          {/* Overlay Guide */}
          {(cameraReady && !capturing) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-white/50 rounded-full w-64 h-64 animate-pulse"></div>
            </div>
          )}

          {/* Reference Photo */}
          {profilePhotoURL && cameraReady && (
            <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-lg">
              <img
                src={profilePhotoURL}
                alt="Profile"
                // Placeholder image for the profile photo
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/60A5FA/FFFFFF/png?text=Ref' }}
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
            disabled={!cameraReady || capturing || !!error}
            // Restored explicit Tailwind classes for the primary button
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 transition duration-150 ease-in-out"
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