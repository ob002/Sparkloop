import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          });
        } else {
          // User exists in Auth but not in Firestore (new user)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            needsOnboarding: true
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const completeOnboarding = async (profileData) => {
    if (!user) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      ...profileData,
      email: user.email,
      createdAt: new Date().toISOString(),
      isVerified: false,
      needsOnboarding: false,
      active: true
    };
    
    await setDoc(userRef, userData, { merge: true });
    setUser({ ...user, ...userData });
  };

  const completeVerification = async (verified) => {
    if (!user) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { 
      isVerified: verified,
      verifiedAt: new Date().toISOString()
    });
    
    setUser({ ...user, isVerified: verified });
  };

  const updateUserProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
    setUser({ ...user, ...updates });
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    completeOnboarding,
    completeVerification,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};