
import { Router } from 'express';

import {
  listarAnimais,
  buscarAnimalPorId,
  cadastrarAnimal,
  atualizarAnimal,
  excluirAnimal
} from '../controllers/clinicaControllers.js';

const router = Router();

// READ: listar animais
router.get('/', listarAnimais);

// READ: buscar animal pelo ID
router.get('/:id', buscarAnimalPorId);

// CREATE: cadastrar animal
router.post('/', cadastrarAnimal);

// UPDATE: editar animal
router.put('/:id', atualizarAnimal);

// DELETE: excluir animal
router.delete('/:id', excluirAnimal);

export default router;
