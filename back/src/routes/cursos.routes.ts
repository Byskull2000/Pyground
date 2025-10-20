import { Router } from 'express';
import * as cursoController from '../controllers/cursos.controller';
import { requireRoles } from '../middleware/roleAuth';
import { RolesEnum } from '@prisma/client';
import { authRequired } from '../middleware/auth';

const router = Router();

router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCursoById);
router.put('/publicar/:id', cursoController.publicateCurso);
router.put('/desactivar/:id', cursoController.deactivateCurso);

export default router;
