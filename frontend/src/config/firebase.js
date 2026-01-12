// Firebase configuration
// Replace with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCp5WW_dWQNX-3J_jjTNNfP-sgEBMOACWo",
  authDomain: "tamil-school-app.firebaseapp.com",
  projectId: "tamil-school-app",
  storageBucket: "tamil-school-app.firebasestorage.app",
  messagingSenderId: "548063537124",
  appId: "1:548063537124:web:055197eb18f9fc9e6c89f1",
  measurementId: "G-KCRCW5LW7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;



