import express from 'express';
import {
  getComentariosByTopico,
  createComentario
} from '../controllers/comentarios.controller';

const router = express.Router();

router.post('', getComentariosByTopico);

router.post('/publicar', createComentario);


export default router;
