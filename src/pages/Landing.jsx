import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="w-20 h-20 animate-pulse text-pink-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
            SparkLoop
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Real connections. Real conversations. Real fast.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-10 py-4 rounded-full text-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 shadow-md"
          >
            Get Started — It Takes 60 Seconds
          </button>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 mb-16 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Tired of dating app ghosting?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-pink-50">
              <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">63%</div>
              <p className="text-sm md:text-base text-gray-700">
                of matches never send a message
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">25%</div>
              <p className="text-sm md:text-base text-gray-700">
                of users report fake photos
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50">
              <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">46%</div>
              <p className="text-sm md:text-base text-gray-700">
                abandon long sign-up forms
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
              <Clock className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">24-Hour Timer</h3>
            <p className="text-gray-600 leading-relaxed">
              Matches expire in 24 hours if no one talks. No more endless silent connections.
              Start real conversations or move on.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Real-Time Selfie Check</h3>
            <p className="text-gray-600 leading-relaxed">
              Take a quick selfie to verify you match your profile photo. Zero catfishing,
              100% authenticity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">60-Second Sign Up</h3>
            <p className="text-gray-600 leading-relaxed">
              Google or GitHub login + 3 quick fields + AI ice-breakers. You're ready to
              match in under a minute.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-12 py-5 rounded-full text-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105 shadow-md"
          >
            Join SparkLoop Now
          </button>
          <p className="text-gray-600 mt-4 text-lg">
            No credit card required. Takes 60 seconds.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 SparkLoop. Real connections start here.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;