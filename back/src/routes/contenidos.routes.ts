import { Router } from 'express';
import * as contenidoController from '../controllers/contenidos.controller';
import { authRequired } from '@/middleware/auth';
import { requireRoles } from '@/middleware/roleAuth';
import { RolesEnum } from '@/types/roles';

const router = Router();

router.get('/topico/:id_topico', contenidoController.getContenidosByTopico);
router.get('/:id', contenidoController.getContenidoById);
router.post('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.createContenidos);
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.updateContenido);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.deleteContenido);

export default router;
