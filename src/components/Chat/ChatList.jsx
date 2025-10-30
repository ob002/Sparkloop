import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDiscoverProfiles, createSwipe, getUserSwipes } from '../services/firestore';
import ProfileCard from '../components/discover/ProfileCard';
import SwipeActions from '../components/discover/SwipeActions';
import { Loader, PartyPopper, Heart } from 'lucide-react';

const Discover = () => {
  const { user, profile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [matchModal, setMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, [user, profile]);

  const loadProfiles = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      // Get already swiped user IDs
      const swipedIds = await getUserSwipes(user.uid);
      
      // Get potential matches
      const potentialMatches = await getDiscoverProfiles(
        user.uid,
        profile.gender,
        profile.interestedIn,
        swipedIds
      );

      setProfiles(potentialMatches);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    if (swiping || currentIndex >= profiles.length) return;

    setSwiping(true);
    const currentProfile = profiles[currentIndex];

    try {
      const result = await createSwipe(user.uid, currentProfile.id, action);

      if (result.matched) {
        // It's a match!
        setMatchedUser(currentProfile);
        setMatchModal(true);
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    } finally {
      setSwiping(false);
    }
  };

  const handleLike = () => handleSwipe('like');
  const handlePass = () => handleSwipe('pass');

  const closeMatchModal = () => {
    setMatchModal(false);
    setMatchedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover</h1>
          <p className="text-gray-600">
            {profiles.length - currentIndex} potential matches nearby
          </p>
        </div>

        {/* Profile Card */}
        {currentProfile ? (
          <div className="max-w-md mx-auto">
            <ProfileCard profile={currentProfile} />
            <SwipeActions
              onPass={handlePass}
              onLike={handleLike}
              disabled={swiping}
            />
            
            {/* Progress */}
            <div className="mt-6 text-center text-sm text-gray-500">
              {currentIndex + 1} of {profiles.length}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No more profiles
            </h2>
            <p className="text-gray-600 mb-6">
              Check back later for new matches!
            </p>
            <button
              onClick={loadProfiles}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {matchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce">
            <PartyPopper className="w-20 h-20 text-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              It's a Match! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You and {matchedUser.displayName} liked each other!
            </p>
            
            <div className="flex gap-3 mb-6">
              <img
                src={profile.photoURL}
                alt="You"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
              />
              <img
                src={matchedUser.photoURL}
                alt={matchedUser.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium">
                ⏰ You have 24 hours to start a conversation or this match expires!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeMatchModal}
                className="flex-1 btn-secondary"
              >
                Keep Swiping
              </button>
              <button
                onClick={() => window.location.href = '/chat'}
                className="flex-1 btn-primary"
              >
                Say Hello
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;