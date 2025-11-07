import { useState, useEffect } from 'react';
import { getUserMatches } from '../services/firestore';
import { getUserProfile } from '../services/auth';

export const useMatches = (userId) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = getUserMatches(userId, async (matchesData) => {
      // Enrich matches with other user's profile data
      const enrichedMatches = await Promise.all(
        matchesData.map(async (match) => {
          const otherUserId = match.users.find(id => id !== userId);
          const otherUserProfile = await getUserProfile(otherUserId);
          
          return {
            ...match,
            otherUser: otherUserProfile,
          };
        })
      );

      setMatches(enrichedMatches);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { matches, loading };
};