import { Router } from 'express';
import * as contenidoController from '../controllers/contenidos.controller';
import { authRequired } from '@/middleware/auth';
import { requireRoles } from '@/middleware/roleAuth';
import { RolesEnum } from '@/types/roles';
import { uploadMultiple, uploadSingle } from '../middleware/upload';

const router = Router();

router.get('/topico/:id_topico', contenidoController.getContenidosByTopico);
router.get('/:id', contenidoController.getContenidoById);
router.post('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.createContenidos);
router.put('/reordenar', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.reorderContenidos);
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.updateContenido);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), contenidoController.deleteContenido);

// Nuevas rutas para subida de archivos
router.post('/upload', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), uploadMultiple, contenidoController.uploadMultipleFiles);
router.post('/upload/single', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), uploadSingle, contenidoController.uploadSingleFile);

export default router;
