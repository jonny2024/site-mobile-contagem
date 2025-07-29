import { database, ref, set, get, onValue } from './firebase-config.js';

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

function criarLinha(produto = "", grupo = "", estoque = "", bar = "", avarias = "") {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <input class="produto" placeholder="Produto" value="${produto}">
    <input class="grupo" placeholder="Grupo" value="${grupo}">
    <input type="number" class="estoque" placeholder="Estoque" value="${estoque}">
    <input type="number" class="bar" placeholder="Bar" value="${bar}">
    <input type="number" class="avarias" placeholder="Avarias" value="${avarias}">
    <button class="remove-btn">X</button>
  `;

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", salvarNoFirebase);
  });

  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.remove();
    salvarNoFirebase();
  });

  tabela.appendChild(row);
}

function salvarNoFirebase() {
  const linhas = document.querySelectorAll(".row");
  const dados = [];

  linhas.forEach(linha => {
    const inputs = linha.querySelectorAll("input");
    dados.push({
      produto: inputs[0].value,
      grupo: inputs[1].value,
      estoque: inputs[2].value,
      bar: inputs[3].value,
      avarias: inputs[4].value,
    });
  });

  set(ref(database, 'contagem'), dados);
}

function carregarDoFirebase() {
  const contagemRef = ref(database, 'contagem');
  onValue(contagemRef, (snapshot) => {
    tabela.innerHTML = "";
    const dados = snapshot.val();
    if (dados) {
      dados.forEach(item => {
        criarLinha(item.produto, item.grupo, item.estoque, item.bar, item.avarias);
      });
    } else {
      criarLinha();
    }
  });
}

addRowBtn.addEventListener("click", () => criarLinha());

resetBtn.addEventListener("click", () => {
  document.querySelectorAll(".row").forEach(row => {
    row.querySelector(".estoque").value = "";
    row.querySelector(".bar").value = "";
    row.querySelector(".avarias").value = "";
  });
  salvarNoFirebase();
});

window.addEventListener("load", carregarDoFirebase);
