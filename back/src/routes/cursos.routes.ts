import { Router } from 'express';
import * as cursoController from '../controllers/cursos.controller';

const router = Router();

router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCursoById);
router.get('/publicar/:id', cursoController.publicateCurso);
router.get('/desactivar/:id', cursoController.deactivateCurso);


export default router;
