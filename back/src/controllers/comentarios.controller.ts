import { Request, Response } from 'express';
import * as comentarioService from '../services/comentarios.service';
import { ApiResponse } from '../utils/apiResponse';

export const getComentariosByTopico = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const comentarioes = await comentarioService.getComentariosByTopico(data);
    return res.json(new ApiResponse(true, comentarioes));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener comentarioes';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createComentario = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newComentario = await comentarioService.createComentario(data);
    return res.status(201).json(new ApiResponse(true, newComentario));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear comentario';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

