import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Heart, Loader } from 'lucide-react';
import SocialLogin from '../components/auth/SocialLogin';
import OnboardingForm from '../components/auth/OnboardingForm';

const Onboarding = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // If user is already verified, redirect to discover
  if (profile?.verified && profile?.onboardingComplete) {
    return <Navigate to="/discover" replace />;
  }

  // If user completed onboarding but not verified, go to verify
  if (profile?.onboardingComplete && !profile?.verified) {
    return <Navigate to="/verify" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-pink-500 to-orange-500 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to SparkLoop</h1>
          <p className="text-xl text-white/90">
            {!user ? 'Sign in to get started' : 'Complete your profile in 60 seconds'}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {!user ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Choose your sign-in method
              </h2>
              <SocialLogin />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Let's set up your profile
              </h2>
              <OnboardingForm userId={user.uid} />
            </>
          )}
        </div>

        {/* Progress Indicator */}
        {user && (
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
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span>Profile</span>
              </div>
              <div className="flex-1 h-1 bg-white/30 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span>Verify</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;