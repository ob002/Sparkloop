import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAS6xXCkoRfDafvN3xbL3Bs5VOVeh92puM",
  authDomain: "sparkloop-b2444.firebaseapp.com",
  projectId: "sparkloop-b2444",
  storageBucket: "sparkloop-b2444.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:0987654321"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;