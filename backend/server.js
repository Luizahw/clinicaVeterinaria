
import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import animaisRoutes from './routes/clinicaRouts.js';
import corsMiddleware from './middlewares/corsMiddleware.js';
import { testarConexao } from './database/conexao.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta do front-end
const caminhoFrontend = path.resolve(__dirname, '../frontend');

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Disponibiliza os arquivos HTML, CSS e JavaScript
app.use(express.static(caminhoFrontend));

// Rota inicial da API
app.get('/api', (req, res) => {
  res.status(200).json({
    mensagem: 'API da Clínica Veterinária funcionando!'
  });
});

// Rotas de gerenciamento dos animais
app.use('/api/animais', animaisRoutes);

// Resposta para rotas da API inexistentes
app.use('/api', (req, res) => {
  res.status(404).json({
    mensagem: 'Rota da API não encontrada.'
  });
});

// Inicia o servidor após testar a conexão com o MySQL
async function iniciarServidor() {
  try {
    await testarConexao();

    app.listen(PORT, () => {
      console.log(
        `Sistema disponível em http://localhost:${PORT}`
      );
    });
  } catch (erro) {
    console.error(
      'Não foi possível conectar ao MySQL. Confira o arquivo .env e se o banco foi criado.'
    );

    console.error(erro.message);
    process.exit(1);
  }
}

iniciarServidor();