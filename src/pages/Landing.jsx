import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-pink-500 to-orange-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="w-20 h-20 animate-pulse" fill="white" />
          </div>
          <h1 className="text-6xl font-bold mb-4">SparkLoop</h1>
          <p className="text-2xl mb-8">Real connections. Real conversations. Real fast.</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-white text-primary-600 px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started - It Takes 60 Seconds
          </button>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Tired of dating app ghosting?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-white text-center">
              <div className="text-5xl font-bold mb-2">63%</div>
              <p className="text-lg">of matches never send a message</p>
            </div>
            <div className="text-white text-center">
              <div className="text-5xl font-bold mb-2">25%</div>
              <p className="text-lg">of users report fake photos</p>
            </div>
            <div className="text-white text-center">
              <div className="text-5xl font-bold mb-2">46%</div>
              <p className="text-lg">abandon long sign-up forms</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">24-Hour Timer</h3>
            <p className="text-gray-600">
              Matches expire in 24 hours if no one talks. No more endless silent connections.
              Start real conversations or move on.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Real-Time Selfie Check</h3>
            <p className="text-gray-600">
              Take a quick selfie to verify you match your profile photo. Zero catfishing,
              100% authenticity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">60-Second Sign Up</h3>
            <p className="text-gray-600">
              Google or GitHub login + 3 quick fields + AI ice-breakers. You're ready to
              match in under a minute.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-white text-primary-600 px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Join SparkLoop Now
          </button>
          <p className="text-white mt-4 text-lg">No credit card required. Takes 60 seconds.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 backdrop-blur-lg py-8">
        <div className="container mx-auto px-4 text-center text-white">
          <p>&copy; 2025 SparkLoop. Real connections start here.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;