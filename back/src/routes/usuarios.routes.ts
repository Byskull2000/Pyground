import { Router } from 'express';
import * as userController from '../controllers/usuarios.controller';
import { requireRoles, requireOwnershipOrAdmin } from '../middleware/roleAuth';
import { authRequired } from '../middleware/auth';
import { RolesEnum } from '../types/roles';

const router = Router();

// Rutas públicas
router.post('/', userController.createUsuario); // Registro de usuario es público

// Rutas protegidas
router.get('/', authRequired, requireRoles([RolesEnum.ADMIN, RolesEnum.ACADEMICO]), userController.getUsuarios);
router.get('/:id', authRequired, requireOwnershipOrAdmin('id'), userController.getUsuarioById);
router.put('/:id', authRequired, requireOwnershipOrAdmin('id'), userController.updateUsuario);
router.delete('/:id', authRequired, requireRoles([RolesEnum.ADMIN]), userController.deleteUsuario);
router.put('/:id/rol', authRequired, requireRoles([RolesEnum.ADMIN]), userController.assignRolUsuario);

export default router;
