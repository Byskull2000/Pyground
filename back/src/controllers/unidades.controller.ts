import { Request, Response } from 'express';
import * as unidadService from '../services/unidades.service';
import { ApiResponse } from '../utils/apiResponse';

export const getUnidadesByEdicion = async (req: Request, res: Response) => {
  try {
    const id_edicion = parseInt(req.params.id_edicion);
    const unidades = await unidadService.getUnidadesByEdicion(id_edicion);
    return res.json(new ApiResponse(true, unidades));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener unidades';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const unidad = await unidadService.getUnidad(id);
    return res.json(new ApiResponse(true, unidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createUnidad = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newUnidad = await unidadService.createUnidad(data);
    return res.status(201).json(new ApiResponse(true, newUnidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedUnidad = await unidadService.updateUnidad(id, data);
    return res.json(new ApiResponse(true, updatedUnidad));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadService.deleteUnidad(id);
    return res.json(new ApiResponse(true, { message: 'Unidad eliminada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const restoreUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadService.restoreUnidad(id);
    return res.json(new ApiResponse(true, { message: 'Unidad restaurada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al restaurar unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const publicateUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadService.publicateUnidad(id);
    return res.json(new ApiResponse(true, { message: 'Unidad publicada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al publicar unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deactivateUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadService.deactivateUnidad(id);
    return res.json(new ApiResponse(true, { message: 'Unidad archivada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al archivar unidad';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};