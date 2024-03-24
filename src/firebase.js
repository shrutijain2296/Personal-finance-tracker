// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzi_mqpGFA6e9xxmwuICO2uSQZ69DZd48",
  authDomain: "finance-tracker-b008c.firebaseapp.com",
  projectId: "finance-tracker-b008c",
  storageBucket: "finance-tracker-b008c.appspot.com",
  messagingSenderId: "420852129084",
  appId: "1:420852129084:web:23a602c5037e2bc00bd239",
  measurementId: "G-3E8JHYYKTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};