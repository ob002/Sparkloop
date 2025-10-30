import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { compareFaces, detectFace } from '../../services/facePlusPlus';
import { Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

function SelfieVerify({ onVerified }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { user, completeVerification } = useAuth();

  // Start camera
  const startCamera = useCallback(async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setError('');
    setSuccess(false);
    startCamera();
  };

  // Verify selfie
  const verifySelfie = async () => {
    if (!capturedImage || !user.photoURL) {
      setError('Missing images for comparison');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Step 1: Detect face in captured image
      const capturedBase64 = capturedImage.split(',')[1];
      const detection = await detectFace(capturedBase64);

      if (!detection.hasFace) {
        setError('No face detected or multiple faces found. Please ensure your face is clearly visible.');
        setVerifying(false);
        return;
      }

      // Step 2: Get profile photo
      const response = await fetch(user.photoURL);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const profileBase64 = reader.result.split(',')[1];

        try {
          // Step 3: Compare faces
          const comparison = await compareFaces(profileBase64, capturedBase64);

          if (comparison.isMatch) {
            setSuccess(true);
            await completeVerification(true);
            
            // Navigate to discover after 2 seconds
            setTimeout(() => {
              onVerified();
            }, 2000);
          } else {
            setError(`Face match confidence too low (${Math.round(comparison.confidence)}%). Please ensure good lighting and face the camera directly.`);
          }
        } catch (err) {
          setError(err.message || 'Verification failed. Please try again.');
        } finally {
          setVerifying(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      setVerifying(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">
              Take a quick selfie to verify you're the person in your profile photo
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Verification successful! Redirecting to discover...</span>
            </div>
          )}

          {/* Camera/Image Display */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
            {!stream && !capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Start Camera
                </button>
              </div>
            )}

            {stream && !capturedImage && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="w-full h-full object-cover"
              />
            )}

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Instructions */}
          {stream && !capturedImage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Make sure your face is clearly visible</li>
                <li>Ensure good lighting</li>
                <li>Remove sunglasses or hats</li>
                <li>Face the camera directly</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {stream && !capturedImage && (
              <>
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}

            {capturedImage && !success && (
              <>
                <button
                  onClick={verifySelfie}
                  disabled={verifying}
                  className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Verify Identity
                    </>
                  )}
                </button>
                <button
                  onClick={retakePhoto}
                  disabled={verifying}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Retake
                </button>
              </>
            )}
          </div>

          {/* Skip Button (for testing only - remove in production) */}
          <button
            onClick={onVerified}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip for now (Testing only)
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Step 2 of 2 - Your privacy is protected
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelfieVerify;