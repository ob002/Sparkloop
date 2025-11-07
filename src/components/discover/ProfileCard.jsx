import React from 'react';
import { MapPin, Briefcase, Heart } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-primary-200 to-pink-200">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="w-24 h-24 text-white/50" />
            </div>
          )}

          {/* Verified Badge */}
          {profile.verified && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              ✓ Verified
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">
              {profile.displayName}, {profile.age}
            </h2>
            {profile.location && (
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.occupation && (
              <div className="flex items-center gap-2 text-white/90">
                <Briefcase className="w-4 h-4" />
                <span>{profile.occupation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio & Interests */}
        <div className="p-6">
          {/* Bio */}
          {profile.bio && (
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ice Breakers */}
          {profile.iceBreakers && profile.iceBreakers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Ask me about
              </h3>
              <div className="space-y-2">
                {profile.iceBreakers.slice(0, 2).map((question, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-lg"
                  >
                    "{question}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;