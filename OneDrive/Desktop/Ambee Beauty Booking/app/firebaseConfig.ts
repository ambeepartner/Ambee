// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAJY8fYDDzzqRDMK7pJs9MUx4TP6zz6Mws",
  authDomain: "ambee-2c2a7.firebaseapp.com",
  projectId: "ambee-2c2a7",
  storageBucket: "ambee-2c2a7.appspot.com",
  messagingSenderId: "60498125461",
  appId: "1:60498125461:android:d8794277e2cd9d876a319c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth (persistence is auto-handled in React Native)
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

export { auth, db, app };
