import { Request, Response } from 'express';
import * as unidadService from '../services/unidades.service';
import { ApiResponse } from '../utils/apiResponse';

export const getUnidadesByEdicion = async (req: Request, res: Response) => {
  try {
    const id_edicion = parseInt(req.params.id_edicion);
    const unidades = await unidadService.getUnidadesByEdicion(id_edicion);
    return res.json(new ApiResponse(true, unidades));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener unidades')
    );
  }
};

export const getUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const unidad = await unidadService.getUnidad(id);
    return res.json(new ApiResponse(true, unidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener unidad')
    );
  }
};

export const createUnidad = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newUnidad = await unidadService.createUnidad(data);
    return res.status(201).json(new ApiResponse(true, newUnidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al crear unidad')
    );
  }
};

export const updateUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedUnidad = await unidadService.updateUnidad(id, data);
    return res.json(new ApiResponse(true, updatedUnidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al actualizar unidad')
    );
  }
};

export const deleteUnidad = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadService.deleteUnidad(id);
    return res.json(new ApiResponse(true, { message: 'Unidad eliminada correctamente' }));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al eliminar unidad')
    );
  }
};
