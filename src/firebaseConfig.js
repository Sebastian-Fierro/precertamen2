// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK1MkWmFYjRYgQCH1qgWNrpzbm7VJSkiQ",
  authDomain: "react28-10-abaea.firebaseapp.com",
  projectId: "react28-10-abaea",
  storageBucket: "react28-10-abaea.firebasestorage.app",
  messagingSenderId: "117812724649",
  appId: "1:117812724649:web:2ad561e706e58063457ab8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);