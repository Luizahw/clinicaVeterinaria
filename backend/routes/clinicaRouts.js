
import { Router } from 'express';

import {
  listarAnimais,
  buscarAnimalPorId,
  cadastrarAnimal,
  atualizarAnimal,
  excluirAnimal
} from '../controllers/livrosController.js';

const router = Router();

// READ: listar todos os animais
router.get('/', listarAnimais);

// READ: consultar um animal específico
router.get('/:id', buscarAnimalPorId);

// CREATE: cadastrar um novo animal
router.post('/', cadastrarAnimal);

// UPDATE: editar um animal existente
router.put('/:id', atualizarAnimal);

// DELETE: excluir um animal
router.delete('/:id', excluirAnimal);

export default router;