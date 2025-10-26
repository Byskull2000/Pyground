import * as unidadPlantillaRepo from '../repositories/unidades.plantilla.repository';
import * as cursoRepo from '../repositories/cursos.repository';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../types/unidades.plantilla.types';

export const getUnidadesPlantilla = async (id_curso:number) => {
  if (await cursoRepo.getCursoById(id_curso) == null) throw { status: 404, message: 'Curso no encontrado' };
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
  if (!data.orden || data.orden === undefined) throw { status: 400, message: 'El orden es obligatorio' };

  if (await unidadPlantillaRepo.getUnidadPlantillaRedudante(data.id_curso, data.titulo) != null) throw { status: 409, message: 'Ya existe una unidad con ese nombre para este curso' };
  
  return unidadPlantillaRepo.createUnidadPlantilla({
    ...data,
    version: data.version ?? 1,
    activo: data.activo ?? true
  });
};

export const updateUnidadPlantilla = async (id: number, data: UnidadPlantillaUpdate) => {
  const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
  if (!unidad) throw { status: 404, message: 'Unidad plantilla no encontrada' };

  return unidadPlantillaRepo.updateUnidadPlantilla(id, data);
};

export const deleteUnidadPlantilla = async (id: number) => {
  const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
  if (!unidad) throw { status: 404, message: 'Unidad plantilla no encontrada' };

  return unidadPlantillaRepo.updateUnidadPlantilla(id, { activo: false });
};
