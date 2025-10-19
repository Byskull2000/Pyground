import { Router } from 'express';
import * as inscripcionesController from '../controllers/inscripciones.controller';

const router = Router();

router.get('/edicion/:id_edicion', inscripcionesController.getInscripcionesByEdicion);
router.get('/:id', inscripcionesController.getInscripcion);
router.post('/', inscripcionesController.createInscripcion);
router.put('/:id', inscripcionesController.updateInscripcion);
router.delete('/:id', inscripcionesController.deleteInscripcion);

router.get('/usuario/:id_usuario', inscripcionesController.getInscripcionesByUsuario);
router.get('/:id_edicion/usuario/:id', inscripcionesController.getInscripcionStatus);

export default router;
