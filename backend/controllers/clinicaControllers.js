
import conexao from '../database/conexao.js';

function validarAnimal(dados) {
  const {
    nome,
    especie,
    raca,
    idade,
    responsavel
  } = dados || {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof especie !== 'string' || !especie.trim() ||
    typeof raca !== 'string' || !raca.trim() ||
    typeof responsavel !== 'string' || !responsavel.trim() ||
    idade === '' ||
    idade === null ||
    idade === undefined ||
    !Number.isInteger(Number(idade)) ||
    Number(idade) < 0
  ) {
    return 'Preencha todos os campos corretamente. A idade deve ser um número inteiro igual ou maior que zero.';
  }

  return null;
}

// READ: listar todos os animais
export async function listarAnimais(req, res) {
  try {
    const [animais] = await conexao.query(
      `SELECT id, nome, especie, raca, idade,
              responsavel, criado_em
       FROM animais
       ORDER BY id DESC`
    );

    return res.status(200).json(animais);
  } catch (erro) {
    console.error('Erro ao listar animais:', erro.message);

    return res.status(500).json({
      mensagem: 'Não foi possível listar os animais.'
    });
  }
}

// READ: buscar um animal pelo ID
export async function buscarAnimalPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido.'
    });
  }

  try {
    const [animais] = await conexao.execute(
      `SELECT id, nome, especie, raca, idade,
              responsavel, criado_em
       FROM animais
       WHERE id = ?`,
      [id]
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      });
    }

    return res.status(200).json(animais[0]);
  } catch (erro) {
    console.error('Erro ao buscar animal:', erro.message);

    return res.status(500).json({
      mensagem: 'Não foi possível consultar o animal.'
    });
  }
}

// CREATE: cadastrar um animal
export async function cadastrarAnimal(req, res) {
  const erroValidacao = validarAnimal(req.body);

  if (erroValidacao) {
    return res.status(400).json({
      mensagem: erroValidacao
    });
  }

  const {
    nome,
    especie,
    raca,
    idade,
    responsavel
  } = req.body;

  try {
    const [resultado] = await conexao.execute(
      `INSERT INTO animais
       (nome, especie, raca, idade, responsavel)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        especie.trim(),
        raca.trim(),
        Number(idade),
        responsavel.trim()
      ]
    );

    const [novoAnimal] = await conexao.execute(
      `SELECT id, nome, especie, raca, idade,
              responsavel, criado_em
       FROM animais
       WHERE id = ?`,
      [resultado.insertId]
    );

    return res.status(201).json({
      mensagem: 'Animal cadastrado com sucesso!',
      animal: novoAnimal[0]
    });
  } catch (erro) {
    console.error('Erro ao cadastrar animal:', erro.message);

    return res.status(500).json({
      mensagem: 'Não foi possível cadastrar o animal.'
    });
  }
}

// UPDATE: atualizar os dados de um animal
export async function atualizarAnimal(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido.'
    });
  }

  const erroValidacao = validarAnimal(req.body);

  if (erroValidacao) {
    return res.status(400).json({
      mensagem: erroValidacao
    });
  }

  const {
    nome,
    especie,
    raca,
    idade,
    responsavel
  } = req.body;

  try {
    // Verifica se o animal existe antes de atualizar
    const [existentes] = await conexao.execute(
      'SELECT id FROM animais WHERE id = ?',
      [id]
    );

    if (existentes.length === 0) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      });
    }

    await conexao.execute(
      `UPDATE animais
       SET nome = ?, especie = ?, raca = ?,
           idade = ?, responsavel = ?
       WHERE id = ?`,
      [
        nome.trim(),
        especie.trim(),
        raca.trim(),
        Number(idade),
        responsavel.trim(),
        id
      ]
    );

    const [animalAtualizado] = await conexao.execute(
      `SELECT id, nome, especie, raca, idade,
              responsavel, criado_em
       FROM animais
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      mensagem: 'Animal atualizado com sucesso!',
      animal: animalAtualizado[0]
    });
  } catch (erro) {
    console.error('Erro ao atualizar animal:', erro.message);

    return res.status(500).json({
      mensagem: 'Não foi possível atualizar o animal.'
    });
  }
}

// DELETE: excluir um animal
export async function excluirAnimal(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido.'
    });
  }

  try {
    const [resultado] = await conexao.execute(
      'DELETE FROM animais WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      });
    }

    return res.status(200).json({
      mensagem: 'Animal excluído com sucesso!'
    });
  } catch (erro) {
    console.error('Erro ao excluir animal:', erro.message);

    return res.status(500).json({
      mensagem: 'Não foi possível excluir o animal.'
    });
  }
}