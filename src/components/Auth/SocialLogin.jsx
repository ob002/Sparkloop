import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Chrome, Heart, AlertCircle } from 'lucide-react';

function SocialLogin({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // User exists - AuthContext will handle navigation based on profile status
        // Just call onSuccess to trigger the auth flow
        onSuccess();
      } else {
        // New user - create basic profile and trigger onboarding
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          profileComplete: false,
          isVerified: false,
          onboardingComplete: false,
          selfieVerified: false
        });
        
        // Call onSuccess to trigger navigation
        onSuccess();
      }
    } catch (err) {
      console.error('Error signing in with Google:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Multiple popup requests - ignore this error
        return;
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SparkLoop</h1>
          <p className="text-white text-opacity-90">
            Find your perfect match with AI-powered connections
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome!
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to start your journey
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <button className="text-pink-500 hover:underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-pink-500 hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-white font-semibold text-lg mb-1">10k+</div>
            <div className="text-white text-opacity-80 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-white font-semibold text-lg mb-1">5k+</div>
            <div className="text-white text-opacity-80 text-sm">Matches Made</div>
          </div>
          <div>
            <div className="text-white font-semibold text-lg mb-1">4.8★</div>
            <div className="text-white text-opacity-80 text-sm">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialLogin;