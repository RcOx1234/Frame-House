import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMbCpBQ2AJBZSRcZvYjfmZXkd9E_YPXmw",
  authDomain: "frame-house-datos.firebaseapp.com",
  projectId: "frame-house-datos",
  storageBucket: "frame-house-datos.firebasestorage.app",
  messagingSenderId: "101178481294",
  appId: "1:101178481294:web:f5ace24cd223d1eb97c7df",
  measurementId: "G-NC8K9V6XFJ"
};

const app = initializeApp(firebaseConfig);

// 🔥 ESTA LÍNEA ES LA CLAVE
export const db = getFirestore(app);