import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgvfcjcWEC9tr4ZGPJIbbIw0aRYRzlINw",
  authDomain: "gdpr---rapid.firebaseapp.com",
  projectId: "gdpr---rapid",
  storageBucket: "gdpr---rapid.firebasestorage.app",
  messagingSenderId: "619539330083",
  appId: "1:619539330083:web:6b53b11e5cc3131bdced96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
