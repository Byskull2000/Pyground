// back/src/routes/topicos.routes.ts
import express from 'express';
import { authRequired } from '../middleware/auth';
import { requireRoles } from '../middleware/roleAuth';
import { RolesEnum } from '../types/roles';
import {
  getTopicosByUnidad,
  getTopicoById,
  createTopico,
  updateTopico,
  deleteTopico,
  reorderTopicos,
} from '../controllers/topicos.controller';

const router = express.Router();

// Todos estos endpoints requieren autenticación y rol de ADMIN o ACADEMICO
router.use(authRequired);
router.use(requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]));

// Obtener tópicos por unidad
router.get('/unidad/:id_unidad', getTopicosByUnidad);

// Obtener tópico por ID
router.get('/:id', getTopicoById);

// Crear nuevo tópico
router.post('/unidad/:id_unidad', createTopico);

router.put('/reordenar', reorderTopicos);

// Actualizar tópico
router.put('/:id', updateTopico);

// Eliminar tópico (soft delete)
router.delete('/:id', deleteTopico);

export default router;
