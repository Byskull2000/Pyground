import { Router } from 'express';
import * as unidadPlantillaController from '../controllers/unidades.plantilla.controller';

const router = Router();

router.get('/curso/:id_curso', unidadPlantillaController.getUnidadesPlantilla);
router.get('/:id', unidadPlantillaController.getUnidadPlantilla);
router.post('/', unidadPlantillaController.createUnidadPlantilla);
router.put('/:id', unidadPlantillaController.updateUnidadPlantilla);
router.delete('/:id', unidadPlantillaController.deleteUnidadPlantilla);

export default router;
