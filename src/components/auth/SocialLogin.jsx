import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithGithub, createUserProfile } from '../../services/auth';
import { Chrome, Github, Loader } from 'lucide-react';

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');

    try {
      let user;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'github') {
        user = await signInWithGithub();
      }

      // Create basic your user profile
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: provider,
      });

      // Redirect to onboarding to complete profile
      navigate('/onboarding');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-4">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Chrome className="w-6 h-6" />
          )}
          Continue with Google
        </button>

        <button
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Github className="w-6 h-6" />
          )}
          Continue with GitHub
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default SocialLogin;