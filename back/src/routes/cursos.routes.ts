import { Router } from 'express';
import * as cursoController from '../controllers/cursos.controller';
import { requireRoles } from '../middleware/roleAuth';
import { RolesEnum } from '@prisma/client';
import { authRequired } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/', cursoController.getCursos); // Lista pública de cursos
router.get('/:id', cursoController.getCursoById); // Detalles públicos del curso

// Las rutas para crear, editar y eliminar cursos deberían estar aquí y ser protegidas
// Estas rutas se implementarán cuando se agreguen los controladores correspondientes

/*
router.post('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), cursoController.createCurso);
router.put('/:id', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), cursoController.updateCurso);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN]), cursoController.deleteCurso);
*/

export default router;
