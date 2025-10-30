import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { generatePersonalizedIcebreaker } from '../../utils/generateIcebreaker';
import { Heart, X, Sparkles, MapPin, Clock } from 'lucide-react';

function Discover({ onChatOpen }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Query for verified users who are not the current user
      const q = query(
        collection(db, 'users'),
        where('isVerified', '==', true),
        where('profileComplete', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const fetchedProfiles = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(profile => profile.id !== user.uid);

      // Shuffle profiles for variety
      const shuffled = fetchedProfiles.sort(() => Math.random() - 0.5);
      setProfiles(shuffled);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (liked) => {
    if (swiping || currentIndex >= profiles.length) return;

    setSwiping(true);
    const currentProfile = profiles[currentIndex];

    if (liked) {
      try {
        // Create a match
        const matchData = {
          user1Id: user.uid,
          user2Id: currentProfile.id,
          user1Name: user.displayName,
          user2Name: currentProfile.displayName,
          user1Photo: user.photoURL,
          user2Photo: currentProfile.photoURL,
          createdAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          messageCount: 0,
          icebreaker: generatePersonalizedIcebreaker(
            user.interests || [],
            currentProfile.interests || []
          ),
          active: true
        };

        const matchRef = await addDoc(collection(db, 'matches'), matchData);
        
        // Navigate to chat with match data
        setTimeout(() => {
          onChatOpen({ 
            id: matchRef.id, 
            ...matchData,
            otherUser: currentProfile 
          });
        }, 500);
      } catch (error) {
        console.error('Error creating match:', error);
      }
    }

    // Move to next profile
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwiping(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding amazing people for you...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No More Profiles</h2>
          <p className="text-gray-600 mb-6">
            Check back later for new people to connect with!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Image */}
        <div className="relative h-96 bg-gradient-to-br from-pink-500 to-purple-600 overflow-hidden">
          {currentProfile.photoURL ? (
            <img
              src={currentProfile.photoURL}
              alt={currentProfile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl text-white">
                {currentProfile.displayName?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">
              {currentProfile.displayName}, {currentProfile.age}
            </h2>
            <p className="flex items-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              {currentProfile.location}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4">
          {/* Bio */}
          {currentProfile.bio && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{currentProfile.bio}</p>
            </div>
          )}

          {/* Interests */}
          {currentProfile.interests && currentProfile.interests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Occupation */}
          {currentProfile.occupation && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Occupation</h3>
              <p className="text-gray-700">{currentProfile.occupation}</p>
            </div>
          )}

          {/* Education */}
          {currentProfile.education && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-700">{currentProfile.education}</p>
            </div>
          )}

          {/* Interested In */}
          {currentProfile.interestedIn && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Interested In</h3>
              <p className="text-gray-700">{currentProfile.interestedIn}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe(false)}
          disabled={swiping}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200"
          aria-label="Pass"
        >
          <X className="w-8 h-8 text-gray-600" />
        </button>

        <button
          onClick={() => handleSwipe(true)}
          disabled={swiping}
          className="w-20 h-20 rounded-full bg-pink-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Like"
        >
          <Heart className="w-10 h-10 text-white" fill="currentColor" />
        </button>
      </div>

      {/* Timer Notice */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-1">24-Hour Conversation Timer</p>
            <p className="text-gray-700">
              Matches expire in 24 hours if no one sends a message. Start chatting to keep the connection alive!
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {currentIndex + 1} of {profiles.length} profiles
      </div>
    </div>
  );
}

export default Discover;