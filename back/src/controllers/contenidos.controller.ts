import { Request, Response } from 'express';
import * as contenidosService from '../services/contenidos.service';
import { ApiResponse } from '../utils/apiResponse';

export const getContenidosByTopico = async (req: Request, res: Response) => {
  try {
    const id_topico = parseInt(req.params.id_topico);
    const contenidos = await contenidosService.getContenidosByTopico(id_topico);
    return res.json(new ApiResponse(true, contenidos));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener contenidos';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getContenidoById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const contenido = await contenidosService.getContenidoById(id);
    return res.json(new ApiResponse(true, contenido));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener el contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createContenidos = async (req: Request, res: Response) => {
  try {
    const id_topico = parseInt(req.body.id_topico);
    const contenidos = req.body.contenidos;
    const newContenidos = await contenidosService.createContenidos(id_topico, contenidos);
    return res.status(201).json(new ApiResponse(true, newContenidos, 'Contenido(s) creado(s) correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateContenido = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedContenido = await contenidosService.updateContenido(id, data);
    return res.json(new ApiResponse(true, updatedContenido, 'Contenido actualizado correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteContenido = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedContenido = await contenidosService.deleteContenido(id);
    return res.json(new ApiResponse(true, deletedContenido, 'Contenido eliminado correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};
