import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { verifyUserIdentity } from '../services/faceVerification';
import SelfieCapture from '../components/verification/SelfieCapture';
import { Shield, Loader, CheckCircle, XCircle } from 'lucide-react';

const Verify = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelfieCapture = async (imageData) => {
    setVerifying(true);

    try {
      const verificationResult = await verifyUserIdentity(
        user.uid,
        imageData,
        profile.photoURL
      );

      setResult(verificationResult);

      if (verificationResult.success) {
        // Redirect to discover after 2 seconds
        setTimeout(() => {
          navigate('/discover');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        success: false,
        message: 'Verification failed. Please try again.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-pink-500 to-orange-500 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Identity Verification</h1>
          <p className="text-xl text-white/90">
            Prove you're really you - it takes 5 seconds
          </p>
        </div>

        {/* Main Content */}
        {!result && !verifying && (
          <SelfieCapture
            onCapture={handleSelfieCapture}
            profilePhotoURL={profile?.photoURL}
          />
        )}

        {/* Verifying State */}
        {verifying && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <Loader className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying your identity...
            </h2>
            <p className="text-gray-600">
              Comparing your selfie with your profile photo
            </p>
          </div>
        )}

        {/* Success Result */}
        {result?.success && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Verification Successful! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-2">{result.message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Confidence: {result.confidence?.toFixed(1)}%
            </p>
            <div className="inline-flex items-center gap-2 text-primary-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Redirecting to discover...</span>
            </div>
          </div>
        )}

        {/* Failed Result */}
        {result && !result.success && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Verification Failed
            </h2>
            <p className="text-lg text-gray-600 mb-6">{result.message}</p>
            {result.confidence && (
              <p className="text-sm text-gray-500 mb-6">
                Confidence: {result.confidence.toFixed(1)}% (minimum 80% required)
              </p>
            )}
            <button onClick={handleRetry} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <span>Sign In</span>
            </div>
            <div className="flex-1 h-1 bg-white/30 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <span>Profile</span>
            </div>
            <div className="flex-1 h-1 bg-white/30 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <span>Verify</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;