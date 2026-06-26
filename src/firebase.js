// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkTciXa-oNyUJXDsIA7DTrf4cVAjf6U0A",
  authDomain: "soletrario-4236b.firebaseapp.com",
  projectId: "soletrario-4236b",
  storageBucket: "soletrario-4236b.firebasestorage.app",
  messagingSenderId: "590788546671",
  appId: "1:590788546671:web:ca93389e319ee0cc04bd9a"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore para usar no app
export const auth = getAuth(app);
export const db = getFirestore(app);
