const tabela = document.getElementById("corpo-tabela");
const btnAdicionar = document.getElementById("adicionar");
const btnZerar = document.getElementById("zerar");
const db = window.firebaseDB;

function criarLinha(produto = "", grupo = "", estoque = 0, bar = 0, avarias = 0) {
  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td><textarea class="produto">${produto}</textarea></td>
    <td><textarea class="grupo">${grupo}</textarea></td>
    <td><input type="number" class="estoque" value="${estoque}"></td>
    <td><input type="number" class="bar" value="${bar}"></td>
    <td><input type="number" class="avarias" value="${avarias}"></td>
    <td class="total">${estoque + bar + avarias}</td>
    <td><button onclick="removerLinha(this)">🗑️</button></td>
  `;

  linha.querySelectorAll("input").forEach(input =>
    input.addEventListener("input", atualizarTotais)
  );

  tabela.appendChild(linha);
}

function atualizarTotais() {
  document.querySelectorAll("#corpo-tabela tr").forEach((linha, index) => {
    const estoque = Number(linha.querySelector(".estoque").value) || 0;
    const bar = Number(linha.querySelector(".bar").value) || 0;
    const avarias = Number(linha.querySelector(".avarias").value) || 0;
    const total = estoque + bar + avarias;
    linha.querySelector(".total").innerText = total;
  });
  salvarNoFirebase();
}

function salvarNoFirebase() {
  const dados = [];
  document.querySelectorAll("#corpo-tabela tr").forEach((linha) => {
    dados.push({
      produto: linha.querySelector(".produto").value,
      grupo: linha.querySelector(".grupo").value,
      estoque: linha.querySelector(".estoque").value,
      bar: linha.querySelector(".bar").value,
      avarias: linha.querySelector(".avarias").value,
    });
  });

  firebaseSet(window.firebaseRef(db, "contagem"), dados);
}

function carregarDoFirebase() {
  window.firebaseGet(window.firebaseChild(window.firebaseRef(db), "contagem"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();
        dados.forEach(item => criarLinha(item.produto, item.grupo, item.estoque, item.bar, item.avarias));
      } else {
        criarLinha(); // ao menos uma linha
      }
    });
}

function removerLinha(botao) {
  botao.parentElement.parentElement.remove();
  atualizarTotais();
}

btnAdicionar.addEventListener("click", () => {
  criarLinha();
});

btnZerar.addEventListener("click", () => {
  document.querySelectorAll("#corpo-tabela tr").forEach((linha) => {
    linha.querySelector(".estoque").value = 0;
    linha.querySelector(".bar").value = 0;
    linha.querySelector(".avarias").value = 0;
  });
  atualizarTotais();
});

window.onload = () => {
  carregarDoFirebase();
};

