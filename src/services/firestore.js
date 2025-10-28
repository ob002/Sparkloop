import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get potential matches for a user (exclude already matched/passed)
 */
export const getDiscoverProfiles = async (userId, userGender, interestedIn, excludeIds = []) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('gender', '==', interestedIn),
      where('onboardingComplete', '==', true),
      where('verified', '==', true),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const profiles = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Exclude current user and already interacted users
      if (doc.id !== userId && !excludeIds.includes(doc.id)) {
        profiles.push({ id: doc.id, ...data });
      }
    });

    return profiles;
  } catch (error) {
    console.error('Error getting discover profiles:', error);
    throw error;
  }
};

/**
 * Create a swipe action (like/pass)
 */
export const createSwipe = async (fromUserId, toUserId, action) => {
  try {
    const swipeRef = doc(db, 'swipes', `${fromUserId}_${toUserId}`);
    await setDoc(swipeRef, {
      fromUserId,
      toUserId,
      action, // 'like' or 'pass'
      createdAt: serverTimestamp(),
    });

    // If action is 'like', check for mutual match
    if (action === 'like') {
      const reverseSwipeRef = doc(db, 'swipes', `${toUserId}_${fromUserId}`);
      const reverseSwipe = await getDoc(reverseSwipeRef);

      if (reverseSwipe.exists() && reverseSwipe.data().action === 'like') {
        // It's a match! Create match document
        await createMatch(fromUserId, toUserId);
        return { matched: true };
      }
    }

    return { matched: false };
  } catch (error) {
    console.error('Error creating swipe:', error);
    throw error;
  }
};

/**
 * Create a match between two users
 */
export const createMatch = async (userId1, userId2) => {
  try {
    const matchId = [userId1, userId2].sort().join('_');
    const matchRef = doc(db, 'matches', matchId);

    await setDoc(matchRef, {
      users: [userId1, userId2],
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      messageCount: 0,
      active: true,
    });

    return matchId;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

/**
 * Get all active matches for a user
 */
export const getUserMatches = (userId, callback) => {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef,
      where('users', 'array-contains', userId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const matches = [];
      snapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() });
      });
      callback(matches);
    });
  } catch (error) {
    console.error('Error getting user matches:', error);
    throw error;
  }
};

/**
 * Send a message in a match
 */
export const sendMessage = async (matchId, senderId, text) => {
  try {
    const messagesRef = collection(db, 'matches', matchId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      text,
      createdAt: serverTimestamp(),
      read: false,
    });

    // Increment message count and update match
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      messageCount: arrayUnion(1).length,
      lastMessageAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Subscribe to messages in a match
 */
export const subscribeToMessages = (matchId, callback) => {
  try {
    const messagesRef = collection(db, 'matches', matchId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    throw error;
  }
};

/**
 * Get swipes made by a user (for excluding from discover)
 */
export const getUserSwipes = async (userId) => {
  try {
    const swipesRef = collection(db, 'swipes');
    const q = query(swipesRef, where('fromUserId', '==', userId));
    const snapshot = await getDocs(q);

    const swipedIds = [];
    snapshot.forEach((doc) => {
      swipedIds.push(doc.data().toUserId);
    });

    return swipedIds;
  } catch (error) {
    console.error('Error getting user swipes:', error);
    throw error;
  }
};