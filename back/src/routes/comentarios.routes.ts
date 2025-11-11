import express from 'express';
import { authRequired } from '../middleware/auth';
import { requireRoles } from '../middleware/roleAuth';
import { RolesEnum } from '../types/roles';
import {
  getComentariosByTopico,
  createComentario
} from '../controllers/comentarios.controller';

const router = express.Router();

router.post('', getComentariosByTopico);

router.post('/publicar', createComentario);


export default router;
