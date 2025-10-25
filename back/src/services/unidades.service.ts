import * as unidadRepo from '../repositories/unidades.repository';
import * as edicionRepo from '../repositories/ediciones.repository';
import { UnidadCreate, UnidadUpdate } from '../types/unidades.types';

export const getUnidadesByEdicion = async (id_edicion: number) => {
  if (await edicionRepo.getEdicionById(id_edicion) == null) throw { status: 404, message: 'Edición no encontrada' };
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
  if (await edicionRepo.getEdicionById(data.id_edicion) == null) throw { status: 404, message: 'Edición no encontrada' };

  if (data.orden === undefined) throw { status: 400, message: 'El orden es obligatorio' };

  if (await unidadRepo.getUnidadRedudante(data.id_edicion, data.titulo) != null) throw { status: 409, message: 'Ya existe una unidad con este titulo en este unidad' };

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

export const restoreUnidad = async (id: number) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) throw { status: 404, message: 'Unidad no encontrada' };

  return unidadRepo.restoreUnidad(id);
};


export const publicateUnidad = async (id: number) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) 
    throw Object.assign(new Error('Unidad no encontrada'), { status: 404 });

  const unidadPublicada = await unidadRepo.publicateUnidad(id);

  return unidadPublicada;
};

export const deactivateUnidad = async (id: number) => {
  const unidad = await unidadRepo.getUnidadById(id);
  if (!unidad) 
    throw Object.assign(new Error('Unidad no encontrada'), { status: 404 });

  const unidadArchivado = await unidadRepo.deactivateUnidad(id);

  return unidadArchivado;
};