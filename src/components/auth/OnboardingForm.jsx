import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../../services/auth';
import { generateIceBreakers, interestOptions } from './src/utils/iceBreakers';
import { Loader, Sparkles } from 'lucide-react';

const OnboardingForm = ({ userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    interestedIn: '',
    bio: '',
    interests: [],
  });

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate AI ice breakers based on interests
      const iceBreakers = generateIceBreakers(formData.interests);

      // Complete onboarding
      await completeOnboarding(userId, {
        ...formData,
        age: parseInt(formData.age),
        iceBreakers,
      });

      // Redirect to verification
      navigate('/verify');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.age && formData.gender && formData.interestedIn && formData.bio.length >= 20 && formData.interests.length >= 3;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="space-y-6">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="input-field"
            placeholder="Enter your age"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['male', 'female', 'non-binary'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData({ ...formData, gender: option })}
                className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                  formData.gender === option
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Interested In */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interested in
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['male', 'female', 'everyone'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData({ ...formData, interestedIn: option })}
                className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                  formData.interestedIn === option
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (minimum 20 characters)
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="input-field resize-none"
            rows="4"
            placeholder="Tell others about yourself..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select at least 3 interests
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInterestToggle(option.value)}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.interests.includes(option.value)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span>{option.emoji}</span>
                <span>{option.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Setting up your profile...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Continue to Verification
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default OnboardingForm;