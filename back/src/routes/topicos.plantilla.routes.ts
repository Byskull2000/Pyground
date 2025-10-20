// back/src/routes/topicos.plantilla.routes.ts
import express from 'express';
import { authRequired } from '../middleware/auth';
import { requireRoles } from '../middleware/roleAuth';
import { RolesEnum } from '../types/roles';
import {
  getTopicosByUnidadPlantilla,
  createTopicoPlantilla,
  updateTopicoPlantilla,
  deleteTopicoPlantilla,
} from '../controllers/topicos.plantilla.controller';

const router = express.Router();

// Todos estos endpoints requieren autenticación y rol de ADMIN
router.use(authRequired);
router.use(requireRoles([RolesEnum.ADMIN]));

// Obtener tópicos por unidad plantilla
router.get('/unidad/:id_unidad_plantilla', getTopicosByUnidadPlantilla);

// Crear nuevo tópico plantilla
router.post('/unidad/:id_unidad_plantilla', createTopicoPlantilla);

// Actualizar tópico plantilla
router.put('/:id', updateTopicoPlantilla);

// Eliminar tópico plantilla (soft delete)
router.delete('/:id', deleteTopicoPlantilla);

export default router;