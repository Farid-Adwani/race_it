// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP0fCAQMZNWDLEkSXwkaD8rRlMXk_8kV4",
  authDomain: "robolympix-5c613.firebaseapp.com",
  databaseURL: "https://robolympix-5c613-default-rtdb.firebaseio.com",
  projectId: "robolympix-5c613",
  storageBucket: "robolympix-5c613.appspot.com",
  messagingSenderId: "383370001044",
  appId: "1:383370001044:web:94152eefcd828d68df5281",
  measurementId: "G-MWCVLERN58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const analytics = getAnalytics(app);