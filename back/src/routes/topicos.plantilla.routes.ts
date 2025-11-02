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

router.use(authRequired);
router.use(requireRoles([RolesEnum.ADMIN]));

router.get('/unidad/:id_unidad_plantilla', getTopicosByUnidadPlantilla);

router.post('/unidad/:id_unidad_plantilla', createTopicoPlantilla);

router.put('/:id', updateTopicoPlantilla);

router.delete('/:id', deleteTopicoPlantilla);

export default router;