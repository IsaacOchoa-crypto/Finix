import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// CREDENCIALES DE FIREBASE INYECTADAS
const firebaseConfig = {
  apiKey: "AIzaSyAS3rjfh48TpMWaWprC-J8_cApeQ01MyUM",
  authDomain: "finix-fa605.firebaseapp.com",
  projectId: "finix-fa605",
  storageBucket: "finix-fa605.firebasestorage.app",
  messagingSenderId: "61267832814",
  appId: "1:61267832814:web:7a15e290cc4d580e10e8ff",
  measurementId: "G-8BFYJGCRSW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
