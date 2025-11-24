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


// Obtener tópicos por unidad
router.get('/unidad/:id_unidad', getTopicosByUnidad);

// Obtener tópico por ID
router.get('/:id', getTopicoById);

// Crear nuevo tópico
router.post('/unidad/:id_unidad', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), createTopico);

router.put('/reordenar', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), reorderTopicos);

// Actualizar tópico
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), updateTopico);

// Eliminar tópico 
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), deleteTopico);


export default router;
