import { Router } from 'express';
import * as cursoController from '../controllers/cursos.controller';
import { authRequired } from '@/middleware/auth';
import { requireRoles } from '@/middleware/roleAuth';
import { RolesEnum } from '@/types/roles';

const router = Router();

router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCursoById);
router.put('/publicar/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), cursoController.publicateCurso);
router.put('/desactivar/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]),cursoController.deactivateCurso);


export default router;
