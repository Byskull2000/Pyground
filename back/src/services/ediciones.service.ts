import * as edicionRepo from '../repositories/ediciones.repository';
import * as cursoRepo from '../repositories/cursos.repository';
import * as unidadPlantillaRepo from '../repositories/unidades.plantilla.repository';
import * as unidadRepo from '../repositories/unidades.repository';
import { EdicionCreate, EdicionUpdate } from '../types/ediciones.types';

export const getEdicionesByCurso = (id_curso:number) => {
  return edicionRepo.getEdicionesByCurso(id_curso);
};

export const getEdicion = async (id: number) => {
  const edicion = await edicionRepo.getEdicionById(id);
  if (!edicion) throw { status: 404, message: 'Edición no encontrada' };
  return edicion;
};

export const createEdicion = async (data: EdicionCreate) => {
  if (!data.nombre_edicion) 
    throw { status: 400, message: 'El nombre de la edición es obligatorio' };
    
  if (!data.id_curso) 
    throw { status: 400, message: 'El curso es obligatorio' };
    
  if (!data.fecha_apertura || isNaN(new Date(data.fecha_apertura).getTime())) 
    throw { status: 400, message: 'La fecha de apertura es inválida' };
    
  if (data.fecha_cierre && isNaN(new Date(data.fecha_cierre).getTime())) 
    throw { status: 400, message: 'La fecha de cierre es inválida' };
    
  if (data.fecha_cierre && new Date(data.fecha_apertura) > new Date(data.fecha_cierre)) 
    throw { status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' };

  const curso = await cursoRepo.getCursoById(data.id_curso);
  if (!curso) 
    throw Object.assign(new Error('Curso no encontrado'), { status: 404 });

  const existente = await edicionRepo.getEdicionesByCursoAndNombre(data.id_curso, data.nombre_edicion);
  if (existente.length > 0) 
    throw Object.assign(new Error('Ya existe una edición con ese nombre para este curso'), { status: 409 });

  const nuevaEdicion:any = await edicionRepo.createEdicion(data);

  // Crear unidades (y cotenidos) de acuerdo a las unidades plantilla del curso
  const unidadesPlantilla = await unidadPlantillaRepo.getUnidadesPlantillaByCurso(data.id_curso);

  if (unidadesPlantilla != null && unidadesPlantilla.length > 0) {
    await unidadRepo.cloneFromPlantillas(unidadesPlantilla, nuevaEdicion.id, data.creado_por);
  }

  let edicionCreada = await edicionRepo.getEdicionById(nuevaEdicion.id);

  return edicionCreada;
};


export const updateEdicion = async (id: number, data: EdicionUpdate) => {
  const edicion = await edicionRepo.getEdicionById(id);
  if (!edicion) throw { status: 404, message: 'Edición no encontrada' };

  return edicionRepo.updateEdicion(id, data);
};

export const deleteEdicion = async (id: number) => {
  const edicion = await edicionRepo.getEdicionById(id);
  if (!edicion) throw { status: 404, message: 'Edición no encontrada' };

  return edicionRepo.deleteEdicion(id);
};

