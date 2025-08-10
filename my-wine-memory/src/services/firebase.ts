import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Handle Service Worker interference with Firestore
if (typeof window !== 'undefined') {
  // Listen for service worker updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', async () => {
      // Re-enable network after service worker update
      try {
        await disableNetwork(db);
        await enableNetwork(db);
        console.log('Firestore network restarted after service worker update');
      } catch (error) {
        console.warn('Failed to restart Firestore network:', error);
      }
    });
  }
}

export default app;