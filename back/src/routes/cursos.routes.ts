import { Router } from 'express';
import * as cursoController from '../controllers/cursos.controller';

const router = Router();

router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCursoById);


export default router;
