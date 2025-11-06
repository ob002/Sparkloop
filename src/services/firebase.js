<<<<<<< HEAD
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // ✅ FIX — add storage
=======
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
>>>>>>> origin/master


const firebaseConfig = {
  apiKey: "AIzaSyAS6xXCkoRfDafvN3xbL3Bs5VOVeh92puM",
  authDomain: "sparkloop-b2444.firebaseapp.com",
  projectId: "sparkloop-b2444",
  storageBucket: "sparkloop-b2444.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:0987654321"
};

const app = initializeApp(firebaseConfig);

<<<<<<< HEAD
// ✅ Modern persistent cache
const db = initializeFirestore(app, {
  localCache: "persistent",
});

const auth = getAuth(app);

// ✅ Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider(); // remove if not needed
=======

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
>>>>>>> origin/master

// ✅ ✅ FIX — Initialize storage
const storage = getStorage(app);

export { app, db, auth, googleProvider, githubProvider, storage };
