import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCn4XEl0Rr8OxU7v0L1bJOHeNc6cSmx7Bs",
  authDomain: "ecommerce-f255d.firebaseapp.com",
  projectId: "ecommerce-f255d",
  storageBucket: "ecommerce-f255d.appspot.com",
  messagingSenderId: "923393128934",
  appId: "1:923393128934:web:7011d26fcc18811ad6be27",
  measurementId: "G-X99FZT6SGQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
