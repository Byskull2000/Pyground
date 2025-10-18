import { Router } from 'express';
import * as inscripcionesController from '../controllers/inscripciones.controller';

const router = Router();

router.get('/edicion/:id_edicion', inscripcionesController.getInscripcionesByEdicion);
router.get('/:id', inscripcionesController.getInscripcion);
router.post('/', inscripcionesController.createInscripcion);
router.put('/:id', inscripcionesController.updateInscripcion);
router.delete('/:id', inscripcionesController.deleteInscripcion);

export default router;
