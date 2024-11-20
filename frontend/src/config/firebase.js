import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByS_RtEe19pdz7srVmKjtUDAb_2uKzYcc",
  authDomain: "plant-analyzer-8ebaa.firebaseapp.com",
  projectId: "plant-analyzer-8ebaa",
  storageBucket: "plant-analyzer-8ebaa.firebasestorage.app",
  messagingSenderId: "83643630828",
  appId: "1:83643630828:web:be20d4db0227fbbc7b51c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
