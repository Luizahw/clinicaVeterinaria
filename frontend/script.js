
const API_URL = '/api/animais';

const form = document.querySelector('#animalForm');
const listaAnimais = document.querySelector('#listaAnimais');
const mensagem = document.querySelector('#mensagem');
const pesquisa = document.querySelector('#pesquisa');
const animalId = document.querySelector('#animalId');
const tituloFormulario = document.querySelector('#tituloFormulario');
const botaoSalvar = document.querySelector('#botaoSalvar');
const botaoCancelar = document.querySelector('#botaoCancelar');
const botaoAtualizar = document.querySelector('#botaoAtualizar');

let animais = [];
let temporizadorMensagem;

function mostrarMensagem(texto, tipo = 'success') {
  clearTimeout(temporizadorMensagem);

  mensagem.textContent = texto;
  mensagem.className = `message ${tipo}`;

  temporizadorMensagem = setTimeout(() => {
    mensagem.classList.add('hidden');
  }, 4500);
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,

    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.headers || {})
    }
  });

  let dados;

  try {
    dados = await resposta.json();
  } catch {
    dados = {};
  }

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
      'Ocorreu um erro ao realizar a operação.'
    );
  }

  return dados;
}

// Busca os animais cadastrados no banco
async function carregarAnimais() {
  listaAnimais.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        Carregando animais...
      </td>
    </tr>
  `;

  try {
    animais = await requisicao(API_URL);

    atualizarResumo();
    renderizarAnimais();
  } catch (erro) {
    listaAnimais.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          Não foi possível carregar os animais.
          Confira se o servidor e o MySQL estão funcionando.
        </td>
      </tr>
    `;

    mostrarMensagem(erro.message, 'error');
  }
}

// Atualiza os contadores
function atualizarResumo() {
  document.querySelector('#totalAnimais').textContent =
    animais.length;

  document.querySelector('#totalCachorros').textContent =
    animais.filter(
      animal => animal.especie.toLowerCase() === 'cachorro'
    ).length;

  document.querySelector('#totalGatos').textContent =
    animais.filter(
      animal => animal.especie.toLowerCase() === 'gato'
    ).length;
}

// Evita interpretar dados do usuário como HTML
function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

// Escolhe um emoji de acordo com a espécie
function emojiAnimal(especie) {
  const tipo = String(especie).toLowerCase();

  if (tipo === 'cachorro') return '🐶';
  if (tipo === 'gato') return '🐱';
  if (tipo === 'ave') return '🐦';
  if (tipo === 'coelho') return '🐰';
  if (tipo === 'roedor') return '🐹';
  if (tipo === 'réptil') return '🦎';

  return '🐾';
}

// Exibe os animais na tabela
function renderizarAnimais() {
  const termo = pesquisa.value
    .trim()
    .toLocaleLowerCase('pt-BR');

  const filtrados = animais.filter(animal =>
    [
      animal.nome,
      animal.especie,
      animal.raca,
      animal.responsavel
    ].some(valor =>
      String(valor)
        .toLocaleLowerCase('pt-BR')
        .includes(termo)
    )
  );

  document.querySelector('#contadorLista').textContent =
    `${filtrados.length} ${
      filtrados.length === 1 ? 'registro' : 'registros'
    }`;

  if (filtrados.length === 0) {
    listaAnimais.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          ${
            termo
              ? 'Nenhum animal corresponde à busca.'
              : 'Nenhum animal cadastrado ainda. Use o formulário para adicionar o primeiro paciente.'
          }
        </td>
      </tr>
    `;

    return;
  }

  listaAnimais.innerHTML = filtrados.map(animal => `
    <tr>
      <td>
        <div class="animal-name">
          <span class="animal-avatar">
            ${emojiAnimal(animal.especie)}
          </span>

          <span>
            ${escaparHTML(animal.nome)}
            <span class="cell-secondary">
              Código #${animal.id}
            </span>
          </span>
        </div>
      </td>

      <td>
        <span class="species-badge">
          ${escaparHTML(animal.especie)}
        </span>

        <span class="cell-secondary">
          ${escaparHTML(animal.raca)}
        </span>
      </td>

      <td>
        ${animal.idade}
        ${Number(animal.idade) === 1 ? 'ano' : 'anos'}
      </td>

      <td>${escaparHTML(animal.responsavel)}</td>

      <td>
        <div class="action-buttons">
          <button
            class="icon-button"
            type="button"
            data-acao="editar"
            data-id="${animal.id}"
            aria-label="Editar ${escaparHTML(animal.nome)}"
            title="Editar"
          >
            ✎
          </button>

          <button
            class="icon-button delete"
            type="button"
            data-acao="excluir"
            data-id="${animal.id}"
            aria-label="Excluir ${escaparHTML(animal.nome)}"
            title="Excluir"
          >
            ⌫
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Limpa o formulário e cancela a edição
function limparFormulario() {
  form.reset();

  animalId.value = '';

  tituloFormulario.textContent = 'Cadastrar animal';
  botaoSalvar.textContent = 'Cadastrar animal';

  botaoCancelar.classList.add('hidden');
}

// CREATE e UPDATE: envio do formulário
form.addEventListener('submit', async evento => {
  evento.preventDefault();

  const dadosAnimal = {
    nome: document.querySelector('#nome').value.trim(),
    especie: document.querySelector('#especie').value,
    raca: document.querySelector('#raca').value.trim(),
    idade: Number(document.querySelector('#idade').value),
    responsavel: document.querySelector('#responsavel').value.trim()
  };

  if (
    !dadosAnimal.nome ||
    !dadosAnimal.especie ||
    !dadosAnimal.raca ||
    !dadosAnimal.responsavel ||
    !Number.isInteger(dadosAnimal.idade) ||
    dadosAnimal.idade < 0
  ) {
    mostrarMensagem(
      'Preencha todos os campos corretamente.',
      'error'
    );

    return;
  }

  const id = animalId.value;
  const editando = Boolean(id);

  try {
    const resultado = await requisicao(
      editando ? `${API_URL}/${id}` : API_URL,
      {
        method: editando ? 'PUT' : 'POST',
        body: JSON.stringify(dadosAnimal)
      }
    );

    limparFormulario();

    await carregarAnimais();

    mostrarMensagem(
      resultado.mensagem || 'Operação realizada com sucesso!'
    );
  } catch (erro) {
    mostrarMensagem(erro.message, 'error');
  }
});

// Trata os botões de editar e excluir
listaAnimais.addEventListener('click', async evento => {
  const botao = evento.target.closest('button[data-acao]');

  if (!botao) return;

  const id = Number(botao.dataset.id);

  const animal = animais.find(
    item => Number(item.id) === id
  );

  if (!animal) return;

  // EDIT: preenche o formulário para edição
  if (botao.dataset.acao === 'editar') {
    animalId.value = animal.id;

    document.querySelector('#nome').value = animal.nome;
    document.querySelector('#especie').value = animal.especie;
    document.querySelector('#raca').value = animal.raca;
    document.querySelector('#idade').value = animal.idade;
    document.querySelector('#responsavel').value =
      animal.responsavel;

    tituloFormulario.textContent = 'Editar animal';
    botaoSalvar.textContent = 'Salvar alterações';

    botaoCancelar.classList.remove('hidden');

    form.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    document.querySelector('#nome').focus({
      preventScroll: true
    });

    return;
  }

  // DELETE: solicita confirmação antes de excluir
  if (botao.dataset.acao === 'excluir') {
    const confirmar = window.confirm(
      `Deseja realmente excluir o cadastro de ${animal.nome}?`
    );

    if (!confirmar) return;

    try {
      const resultado = await requisicao(
        `${API_URL}/${id}`,
        { method: 'DELETE' }
      );

      await carregarAnimais();

      mostrarMensagem(
        resultado.mensagem || 'Animal excluído com sucesso!'
      );

      if (Number(animalId.value) === id) {
        limparFormulario();
      }
    } catch (erro) {
      mostrarMensagem(erro.message, 'error');
    }
  }
});

// Botão para cancelar a edição
botaoCancelar.addEventListener('click', limparFormulario);

// Botão para atualizar a lista
botaoAtualizar.addEventListener('click', carregarAnimais);

// Pesquisa os animais enquanto o usuário digita
pesquisa.addEventListener('input', renderizarAnimais);

// Carrega os registros ao abrir a página
carregarAnimais();