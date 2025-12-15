// === 1. CONFIGURAÇÃO DO FIREBASE (SUBSTITUA PELOS SEUS DADOS) ===
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// === 2. ELEMENTOS DA PÁGINA ===
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementElementById