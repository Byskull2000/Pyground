import * as unidadPlantillaRepo from '../repositories/unidades.plantilla.repository';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../types/unidades.plantilla.types';

export const getUnidadesPlantilla = (id_curso:number) => {
  return unidadPlantillaRepo.getUnidadesPlantillaByCurso(id_curso);
};

export const getUnidadPlantilla = async (id: number) => {
  const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
  if (!unidad) throw { status: 404, message: 'Unidad plantilla no encontrada' };
  return unidad;
};

export const createUnidadPlantilla = async (data: UnidadPlantillaCreate) => {
  if (!data.titulo) throw { status: 400, message: 'El título es obligatorio' };
  if (!data.id_curso) throw { status: 400, message: 'El curso es obligatorio' };
  if (data.orden === undefined) throw { status: 400, message: 'El orden es obligatorio' };
  if (data.version === undefined) throw { status: 400, message: 'La versión es obligatoria' };

  return unidadPlantillaRepo.createUnidadPlantilla(data);
};

export const updateUnidadPlantilla = async (id: number, data: UnidadPlantillaUpdate) => {
  const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
  if (!unidad) throw { status: 404, message: 'Unidad plantilla no encontrada' };

  return unidadPlantillaRepo.updateUnidadPlantilla(id, data);
};

export const deleteUnidadPlantilla = async (id: number) => {
  const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
  if (!unidad) throw { status: 404, message: 'Unidad plantilla no encontrada' };

  // borrado lógico
  return unidadPlantillaRepo.updateUnidadPlantilla(id, { activo: false });
};
