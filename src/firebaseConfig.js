import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAsrLxJac7Suzo2risjqfPhNjD3CIpxhm8",
  authDomain: "tung-pham-bank.firebaseapp.com",
  projectId: "tung-pham-bank",
  storageBucket: "tung-pham-bank.firebasestorage.app",
  messagingSenderId: "1023875062007",
  appId: "1:1023875062007:web:654333b95682d642d79bf2",
  measurementId: "G-06N6ZV834F",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
