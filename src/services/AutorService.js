const pool = require('../config/database');

async function listarAutores() {
  const [autores] = await pool.query('SELECT * FROM autores');
  return autores;
}

async function adicionarAutor(Autor) {
  const { nome, biografia, data_nasc } = Autor;
  // Você vai criar o INSERT INTO abaixo.
  const [results] = await pool.query('INSERT INTO autores (nome, biografia, data_nasc) VALUES (?, ?, ?)', [nome, biografia, data_nasc]);
  return results.insertId;
}

async function atualizarAutor(id, Autor) {
  const { nome, biografia, data_nasc } = Autor;
  // Você vai criar o UPDATE abaixo.
  await pool.query('UPDATE autores SET nome = ?, biografia = ?, data_nasc = ? WHERE id = ?', [nome, biografia, data_nasc, id]);
}

async function deletarAutor(id) {
  // Você vai criar o DELETE abaixo.
  await pool.query('DELETE FROM autores WHERE id = ?', [id]);
}

module.exports = {
  listarAutores,
  adicionarAutor,
  atualizarAutor,
  deletarAutor
};