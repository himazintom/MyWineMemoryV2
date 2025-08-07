import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDVC5fhY6HfIe9uuxPtaiPSmWgBD3iboWY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mywinememory-4bdf9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mywinememory-4bdf9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mywinememory-4bdf9.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1050687649828",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1050687649828:web:5b2b38ef4f4f2b4d7c8e9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;