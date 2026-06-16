import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoavzFhfl2Hnp3GVKElnAJGUqJVTd02IE",
  authDomain: "myspacepage.firebaseapp.com",
  projectId: "myspacepage",
  storageBucket: "myspacepage.firebasestorage.app",
  messagingSenderId: "465708345597",
  appId: "1:465708345597:web:7680f2b28ed2ef96527694",
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
