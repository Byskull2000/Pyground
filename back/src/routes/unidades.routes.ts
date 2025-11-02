import { Router } from 'express';
import * as unidadController from '../controllers/unidades.controller';
import { authRequired } from '@/middleware/auth';
import { requireRoles } from '@/middleware/roleAuth';
import { RolesEnum } from '@/types/roles';

const router = Router();

router.get('/edicion/:id_edicion', unidadController.getUnidadesByEdicion);
router.get('/:id', unidadController.getUnidad);
router.post('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.createUnidad);
router.put('/restaurar/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.restoreUnidad);
router.put('/publicar/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.publicateUnidad);
router.put('/desactivar/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.deactivateUnidad);
router.put('/reordenar', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.reorderUnidades);
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.updateUnidad);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), unidadController.deleteUnidad);

export default router;
