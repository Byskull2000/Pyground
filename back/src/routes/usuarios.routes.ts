import { Router } from 'express';
import * as userController from '../controllers/usuarios.controller';

const router = Router();

router.get('/', userController.getUsuarios);
router.get('/:id', userController.getUsuarioById);
router.post('/', userController.createUsuario);
router.put('/:id', userController.updateUsuario);
router.delete('/:id', userController.deleteUsuario);
router.put('/:id/rol', userController.assignRolUsuario);

export default router;
