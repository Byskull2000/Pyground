import * as unidadRepo from '../repositories/unidades.repository';
import { UnidadCreate, UnidadUpdate } from '../types/unidades.types';

export const getUnidadesByEdicion = (id_edicion: number) => {
  return unidadRepo.getUnidadesByEdicion(id_edicion);
};

export const getUnidad = async (id: number) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) throw { status: 404, message: 'Unidad no encontrada' };
  return unidad;
};

export const createUnidad = async (data: UnidadCreate) => {
  if (!data.titulo) throw { status: 400, message: 'El título es obligatorio' };
  if (!data.id_edicion) throw { status: 400, message: 'La edición es obligatoria' };
  if (data.orden === undefined) throw { status: 400, message: 'El orden es obligatorio' };

  return unidadRepo.createUnidad(data);
};

export const updateUnidad = async (id: number, data: UnidadUpdate) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) throw { status: 404, message: 'Unidad no encontrada' };

  return unidadRepo.updateUnidad(id, data);
};

export const deleteUnidad = async (id: number) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) throw { status: 404, message: 'Unidad no encontrada' };

  return unidadRepo.deleteUnidad(id);
};
