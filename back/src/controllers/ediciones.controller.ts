import { Request, Response } from 'express';
import * as edicionService from '../services/ediciones.service';
import { ApiResponse } from '../utils/apiResponse';

export const getEdicionesByCurso = async (req: Request, res: Response) => {
  try {
    const id_curso = parseInt(req.params.id_curso);
    const ediciones = await edicionService.getEdicionesByCurso(id_curso);
    return res.json(new ApiResponse(true, ediciones));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener ediciones';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const edicion = await edicionService.getEdicion(id);
    return res.json(new ApiResponse(true, edicion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener la edición';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createEdicion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newEdicion = await edicionService.createEdicion(data);
    return res.status(201).json(new ApiResponse(true, newEdicion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear la edición';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedEdicion = await edicionService.updateEdicion(id, data);
    return res.json(new ApiResponse(true, updatedEdicion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar la edición';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await edicionService.deleteEdicion(id);
    return res.json(new ApiResponse(true, { message: 'Edición eliminada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar la edición';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};
