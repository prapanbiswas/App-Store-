import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAhSzyz6Wi6QDNlNF-ajlyVf4dvF0gp21o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prapan-app-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prapan-app-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prapan-app-store.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "35967167202",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:35967167202:web:7de764c690e94f52f50cbb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-91EZRTEKMS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
