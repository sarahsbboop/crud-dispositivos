const URL_API = 'https://api.restful-api.dev/objects';

let dispositivos = [];

const campoId = document.getElementById('campoId');
const campoNome = document.getElementById('campoNome');
const campoCor = document.getElementById('campoCor');
const campoCapacidade = document.getElementById('campoCapacidade');
const campoPreco = document.getElementById('campoPreco');
const corpoTabela = document.getElementById('corpoTabela');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(txt) {
  mensagem.innerText = txt;
}

function limpar() {
  campoId.value = '';
  campoNome.value = '';
  campoCor.value = '';
  campoCapacidade.value = '';
  campoPreco.value = '';
}

function renderizar() {
  corpoTabela.innerHTML = '';

  dispositivos.forEach(item => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.data?.color || '-'}</td>
      <td>${item.data?.capacity || '-'}</td>
      <td>${item.data?.price || '-'}</td>
    `;

    linha.onclick = () => {
      campoId.value = item.id;
      campoNome.value = item.name;
      campoCor.value = item.data?.color || '';
      campoCapacidade.value = item.data?.capacity || '';
      campoPreco.value = item.data?.price || '';
    };

    corpoTabela.appendChild(linha);
  });
}

async function listar() {
  const res = await fetch(URL_API);
  const dados = await res.json();

  dispositivos = dados;
  renderizar();
  mostrarMensagem("Listado!");
}

async function buscar() {
  const id = campoId.value;

  if (!id) return mostrarMensagem("Digite ID");

  const res = await fetch(`${URL_API}/${id}`);

  if (!res.ok) return mostrarMensagem("Não encontrado");

  const item = await res.json();

  dispositivos = [item];
  renderizar();

  campoNome.value = item.name;
  campoCor.value = item.data?.color || '';
  campoCapacidade.value = item.data?.capacity || '';
  campoPreco.value = item.data?.price || '';
}

async function cadastrar() {
  const novo = {
    name: campoNome.value,
    data: {
      color: campoCor.value,
      capacity: campoCapacidade.value,
      price: parseFloat(campoPreco.value) || 0
    }
  };

  const res = await fetch(URL_API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(novo)
  });

  const criado = await res.json();

  dispositivos.push(criado);
  renderizar();
  limpar();

  mostrarMensagem("Cadastrado!");
}

async function atualizar() {
  const id = campoId.value;

  const atualizado = {
    name: campoNome.value,
    data: {
      color: campoCor.value,
      capacity: campoCapacidade.value,
      price: parseFloat(campoPreco.value) || 0
    }
  };

  const res = await fetch(`${URL_API}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(atualizado)
  });

  const item = await res.json();

  const i = dispositivos.findIndex(d => d.id === id);
  if (i !== -1) dispositivos[i] = item;

  renderizar();
  mostrarMensagem("Atualizado!");
}

async function excluir() {
  const id = campoId.value;

  if (!confirm("Excluir?")) return;

  await fetch(`${URL_API}/${id}`, { method: 'DELETE' });

  dispositivos = dispositivos.filter(d => d.id !== id);

  renderizar();
  limpar();

  mostrarMensagem("Excluído!");
}

document.getElementById('btnListar').onclick = listar;
document.getElementById('btnBuscar').onclick = buscar;
document.getElementById('btnCadastrar').onclick = cadastrar;
document.getElementById('btnAtualizar').onclick = atualizar;
document.getElementById('btnExcluir').onclick = excluir;