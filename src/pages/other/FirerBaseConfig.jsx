// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);