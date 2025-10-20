import { Router } from 'express';
import * as unidadPlantillaController from '../controllers/unidades.plantilla.controller';
import { authRequired } from '@/middleware/auth';
import { requireRoles } from '@/middleware/roleAuth';
import { RolesEnum } from '@/types/roles';

const router = Router();

router.get('/curso/:id_curso', unidadPlantillaController.getUnidadesPlantilla);
router.get('/:id', unidadPlantillaController.getUnidadPlantilla);
router.post('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadPlantillaController.createUnidadPlantilla);
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadPlantillaController.updateUnidadPlantilla);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadPlantillaController.deleteUnidadPlantilla);

export default router;
