
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conexao = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_veterinaria',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testarConexao() {
  const connection = await conexao.getConnection();

  try {
    await connection.ping();
    console.log('Conexão com o MySQL realizada com sucesso.');
  } finally {
    connection.release();
  }
}

export default conexao;