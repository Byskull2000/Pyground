import { Request, Response } from 'express';
import * as unidadPlantillaService from '../services/unidades.plantilla.service';
import { ApiResponse } from '../utils/apiResponse';

export const getUnidadesPlantilla = async (req: Request, res: Response) => {
  try {
    const id_curso = parseInt(req.params.id_curso);
    const unidades = await unidadPlantillaService.getUnidadesPlantilla(id_curso);
    return res.json(new ApiResponse(true, unidades));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener unidades plantilla';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const unidad = await unidadPlantillaService.getUnidadPlantilla(id);
    return res.json(new ApiResponse(true, unidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener unidad plantilla';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newUnidad = await unidadPlantillaService.createUnidadPlantilla(data);
    return res.status(201).json(new ApiResponse(true, newUnidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear unidad plantilla';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedUnidad = await unidadPlantillaService.updateUnidadPlantilla(id, data);
    return res.json(new ApiResponse(true, updatedUnidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar unidad plantilla';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadPlantillaService.deleteUnidadPlantilla(id);
    return res.json(new ApiResponse(true, { message: 'Unidad plantilla eliminada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar unidad plantilla';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};