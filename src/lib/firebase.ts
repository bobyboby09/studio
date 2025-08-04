// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-maestro",
  "appId": "1:620423714254:web:4c1b112b530b4cce0a879f",
  "storageBucket": "studio-maestro.firebasestorage.app",
  "apiKey": "AIzaSyBoUNJ-KpUAI8rqCYfgNJvzAnAiiGwI_cA",
  "authDomain": "studio-maestro.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "620423714254"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
