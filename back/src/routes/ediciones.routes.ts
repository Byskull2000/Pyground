import { Router } from 'express';
import * as edicionesController from '../controllers/ediciones.controller';

const router = Router();

router.get('/curso/:id_curso', edicionesController.getEdicionesByCurso);
router.get('/:id', edicionesController.getEdicion);
router.post('/', edicionesController.createEdicion);
router.put('/:id', edicionesController.updateEdicion);
router.delete('/:id', edicionesController.deleteEdicion);

export default router;
