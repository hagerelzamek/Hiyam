// src/FirerBaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_sSCP7v7fWLRMvEi4cwWPw6t81RtvBaU",
  authDomain: "hiyam-cosmetics.firebaseapp.com",
  projectId: "hiyam-cosmetics",
  storageBucket: "hiyam-cosmetics.appspot.com",
  messagingSenderId: "632338715857",
  appId: "1:632338715857:web:4d95d82d1a0f854f16e1f0",
  measurementId: "G-LTM9PC63X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const analytics = getAnalytics(app); // Initialize Firebase Analytics (optional)

export { auth }; // Export the auth instance
