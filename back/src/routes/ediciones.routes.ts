import { Router } from 'express';
import * as edicionesController from '../controllers/ediciones.controller';
import { requireRoles } from '../middleware/roleAuth';
import { authRequired } from '../middleware/auth';
import { RolesEnum } from '../types/roles';

const router = Router();

// Rutas públicas (solo para ediciones publicadas)
router.get('/curso/:id_curso', edicionesController.getEdicionesByCurso);
router.get('/:id', edicionesController.getEdicion);

// Rutas protegidas
router.post('/', 
  authRequired, 
  requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), 
  edicionesController.createEdicion
);

router.put('/:id', 
  authRequired, 
  requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), 
  edicionesController.updateEdicion
);

router.delete('/:id', 
  authRequired, 
  requireRoles([RolesEnum.ADMIN]), 
  edicionesController.deleteEdicion
);

export default router;
