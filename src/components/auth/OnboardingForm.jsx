import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, MapPin, Heart, Briefcase, GraduationCap, AlertCircle } from 'lucide-react';

function OnboardingForm({ onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    age: '',
    gender: '',
    interestedIn: '',
    location: '',
    bio: '',
    interests: [],
    occupation: '',
    education: ''
  });

  const interestOptions = [
    'Music', 'Movies', 'Sports', 'Reading', 'Travel', 'Cooking',
    'Gaming', 'Art', 'Photography', 'Fitness', 'Technology', 'Fashion'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.displayName && formData.age && formData.gender && formData.interestedIn;
      case 2:
        return formData.location && formData.bio;
      case 3:
        return formData.interests.length >= 3;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      setError('Please complete all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...formData,
        age: parseInt(formData.age),
        profileComplete: true,
        onboardingComplete: true,
        updatedAt: serverTimestamp()
      });

      // Call onComplete to trigger navigation to verification
      onComplete();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Display Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="How should we call you?"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Age *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="100"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Your age"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          I am *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['Male', 'Female', 'Other'].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, gender: option }))}
              className={`py-3 rounded-lg font-medium transition-all ${
                formData.gender === option
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Interested in *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['Men', 'Women', 'Everyone'].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, interestedIn: option }))}
              className={`py-3 rounded-lg font-medium transition-all ${
                formData.interestedIn === option
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="City, Country"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Bio *
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          maxLength="500"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors resize-none"
          placeholder="Tell us about yourself..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.bio.length}/500 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Occupation
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="What do you do?"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Education
        </label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Your education background"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Select at least 3 interests *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {interestOptions.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                formData.interests.includes(interest)
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Selected: {formData.interests.length} / 12
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 && 'Basic Information'}
                {step === 2 && 'About You'}
                {step === 3 && 'Your Interests'}
              </h2>
              <p className="text-gray-600">
                {step === 1 && "Let's get to know you"}
                {step === 2 && 'Tell us more about yourself'}
                {step === 3 && 'What do you enjoy?'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingForm;