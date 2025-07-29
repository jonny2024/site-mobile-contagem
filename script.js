import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMVXlYLkJ7CU-4_k75f8wFzMEzAr4g_2g",
  authDomain: "contagemdeprodutos-62d48.firebaseapp.com",
  databaseURL: "https://contagemdeprodutos-62d48-default-rtdb.firebaseio.com",
  projectId: "contagemdeprodutos-62d48",
  storageBucket: "contagemdeprodutos-62d48.appspot.com",
  messagingSenderId: "203996681838",
  appId: "1:203996681838:web:c1ef444145e7086998387f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tabela = document.getElementById("corpo-tabela");

function salvarDados() {
  const dados = [];
  tabela.querySelectorAll("tr").forEach(tr => {
    const produto = tr.querySelector(".produto").value;
    const grupo = tr.querySelector(".grupo").value;
    const estoque = tr.querySelector(".estoque").value;
    const bar = tr.querySelector(".bar").value;
    const avarias = tr.querySelector(".avarias").value;
    const total = parseInt(estoque || 0) + parseInt(bar || 0) + parseInt(avarias || 0);
    dados.push({ produto, grupo, estoque, bar, avarias, total });
  });

  set(ref(db, "produtos"), dados);
}

function carregarDados() {
  onValue(ref(db, "produtos"), snapshot => {
    const data = snapshot.val();
    tabela.innerHTML = "";
    if (data) {
      data.forEach(linha => adicionarLinha(linha));
    }
  });
}

function atualizarTotal(tr) {
  const estoque = parseInt(tr.querySelector(".estoque").value || 0);
  const bar = parseInt(tr.querySelector(".bar").value || 0);
  const avarias = parseInt(tr.querySelector(".avarias").value || 0);
  const total = estoque + bar + avarias;
  tr.querySelector(".total").textContent = total;
  salvarDados();
}

window.adicionarLinha = function (valores = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input class="produto" value="${valores.produto || ""}"></td>
    <td><input class="grupo" value="${valores.grupo || ""}"></td>
    <td><input class="estoque" type="number" value="${valores.estoque || 0}"></td>
    <td><input class="bar" type="number" value="${valores.bar || 0}"></td>
    <td><input class="avarias" type="number" value="${valores.avarias || 0}"></td>
    <td class="total">${valores.total || 0}</td>
    <td><button onclick="excluirLinha(this)">🗑</button></td>
  `;

  tr.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => atualizarTotal(tr));
  });

  tabela.appendChild(tr);
  salvarDados();
};

window.excluirLinha = function (btn) {
  btn.closest("tr").remove();
  salvarDados();
};

window.zerarContagem = function () {
  tabela.querySelectorAll("tr").forEach(tr => {
    tr.querySelector(".estoque").value = 0;
    tr.querySelector(".bar").value = 0;
    tr.querySelector(".avarias").value = 0;
    atualizarTotal(tr);
  });
  salvarDados();
};

carregarDados();
