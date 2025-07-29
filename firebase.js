import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMVXlYLkJ7CU-4_k75f8wFzMEzAr4g_2g",
  authDomain: "contagemdeprodutos-62d48.firebaseapp.com",
  databaseURL: "https://contagemdeprodutos-62d48-default-rtdb.firebaseio.com",
  projectId: "contagemdeprodutos-62d48",
  storageBucket: "contagemdeprodutos-62d48.appspot.com",
  messagingSenderId: "203996681838",
  appId: "1:203996681838:web:c1ef444145e7086998387f",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
window.firebaseDB = db;
window.firebaseRef = ref;
window.firebaseSet = set;
window.firebaseGet = get;
window.firebaseChild = child;
window.firebaseApp = app;
