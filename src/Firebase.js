import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXewQWg5JE2qdGt5wICR89_F7drV4odvg",
  authDomain: "librox-56271.firebaseapp.com",
  projectId: "librox-56271",
  storageBucket: "librox-56271.firebasestorage.app",
  messagingSenderId: "313930761251",
  appId: "1:313930761251:web:ae716f3499f1dcdbea5d96",
  measurementId: "G-SMW4BFN6EL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const firestore_database = getFirestore(app)
