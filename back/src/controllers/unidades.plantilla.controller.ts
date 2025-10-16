import { Request, Response } from 'express';
import * as unidadPlantillaService from '../services/unidades.plantilla.service';
import { ApiResponse } from '../utils/apiResponse';

export const getUnidadesPlantilla = async (req: Request, res: Response) => {
  try {
    const id_curso = parseInt(req.params.id_curso);
    const unidades = await unidadPlantillaService.getUnidadesPlantilla(id_curso);
    return res.json(new ApiResponse(true, unidades));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener unidades plantilla')
    );
  }
};

export const getUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const unidad = await unidadPlantillaService.getUnidadPlantilla(id);
    return res.json(new ApiResponse(true, unidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al obtener unidad plantilla')
    );
  }
};

export const createUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newUnidad = await unidadPlantillaService.createUnidadPlantilla(data);
    return res.status(201).json(new ApiResponse(true, newUnidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al crear unidad plantilla')
    );
  }
};

export const updateUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedUnidad = await unidadPlantillaService.updateUnidadPlantilla(id, data);
    return res.json(new ApiResponse(true, updatedUnidad));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al actualizar unidad plantilla')
    );
  }
};

export const deleteUnidadPlantilla = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await unidadPlantillaService.deleteUnidadPlantilla(id);
    return res.json(new ApiResponse(true, { message: 'Unidad plantilla eliminada correctamente' }));
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json(
      new ApiResponse(false, null, err.message || 'Error al eliminar unidad plantilla')
    );
  }
};
