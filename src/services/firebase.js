import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // ✅ FIX — add storage

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// ✅ Modern persistent cache
const db = initializeFirestore(app, {
  localCache: "persistent",
});

const auth = getAuth(app);

// ✅ Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider(); // remove if not needed

// ✅ ✅ FIX — Initialize storage
const storage = getStorage(app);

export { app, db, auth, googleProvider, githubProvider, storage };
