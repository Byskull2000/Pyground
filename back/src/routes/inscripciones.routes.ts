import { Router } from 'express';
import * as inscripcionesController from '../controllers/inscripciones.controller';
import { requireRoles, requireOwnershipOrAdmin } from '../middleware/roleAuth';
import { authRequired } from '../middleware/auth';
import { RolesEnum } from '../types/roles';

const router = Router();

// Rutas protegidas para académicos y admins
router.get('/edicion/:id_edicion', 
  authRequired,
  requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]),
  inscripcionesController.getInscripcionesByEdicion
);

// Rutas protegidas que requieren ser dueño o admin
router.get('/usuario/:id_usuario', 
  authRequired,
  requireOwnershipOrAdmin('id_usuario'),
  inscripcionesController.getInscripcionesByUsuario
);

router.get('/:id_edicion/usuario/:id', 
  authRequired,
  requireOwnershipOrAdmin('id'),
  inscripcionesController.getInscripcionStatus
);

// Rutas protegidas generales
router.get('/:id', 
  authRequired,
  inscripcionesController.getInscripcion
);

router.post('/', 
  authRequired,
  inscripcionesController.createInscripcion
);

router.put('/:id', 
  authRequired,
  requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]),
  inscripcionesController.updateInscripcion
);

router.delete('/:id', 
  authRequired,
  requireRoles([RolesEnum.ADMIN]),
  inscripcionesController.deleteInscripcion
);

export default router;
