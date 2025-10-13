import { Request, Response } from 'express';
import * as edicionService from '../services/ediciones.service';
import { ApiResponse } from '../utils/apiResponse';

export const getEdicionesByCurso = async (req: Request, res: Response) => {
  try {
    const id_curso = parseInt(req.params.id_curso);
    const ediciones = await edicionService.getEdicionesByCurso(id_curso);
    return res.json(new ApiResponse(true, ediciones));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener ediciones')
    );
  }
};

export const getEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const edicion = await edicionService.getEdicion(id);
    return res.json(new ApiResponse(true, edicion));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener la edición')
    );
  }
};

export const createEdicion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newEdicion = await edicionService.createEdicion(data);
    return res.status(201).json(new ApiResponse(true, newEdicion));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al crear la edición')
    );
  }
};

export const updateEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedEdicion = await edicionService.updateEdicion(id, data);
    return res.json(new ApiResponse(true, updatedEdicion));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al actualizar la edición')
    );
  }
};

export const deleteEdicion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await edicionService.deleteEdicion(id);
    return res.json(new ApiResponse(true, { message: 'Edición eliminada correctamente' }));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al eliminar la edición')
    );
  }
};
