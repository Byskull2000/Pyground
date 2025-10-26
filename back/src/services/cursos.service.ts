import * as cursoRepo from '../repositories/cursos.repository';
import * as unidadPlantillaRepo from '../repositories/unidades.plantilla.repository';
import * as topicoPlantillaRepo from '../repositories/topicos.plantilla.repository';

import { CursoResponse } from '../types/cursos.types';

export const getCursos = async (): Promise<CursoResponse[]> => {
  const cursos = await cursoRepo.getAllCursos();
  return cursos.map(c => ({
    id: c.id,
    nombre: c.nombre,
    descripcion: c.descripcion,
    codigo_curso: c.codigo_curso,
    activo: c.activo ?? true,
    fecha_creacion: c.fecha_creacion,
    creado_por: c.creado_por,
    estado_publicado: c.estado_publicado
  }));
};

export const getCursoById = async (id: number): Promise<CursoResponse | null> => {
  const c = await cursoRepo.getCursoById(id);
  if (!c) return null;
  return {
    id: c.id,
    nombre: c.nombre,
    descripcion: c.descripcion,
    codigo_curso: c.codigo_curso,
    activo: c.activo ?? true,
    fecha_creacion: c.fecha_creacion,
    creado_por: c.creado_por
  };
};


export const publicateCurso = async (id: number) => {
  const curso = await cursoRepo.getCursoById(id);
  if (!curso) 
    throw Object.assign(new Error('Curso no encontrado'), { status: 404 });

  const unidadesPlantillaListas = await unidadPlantillaRepo.getUnidadesPlantillaByCurso(id);

  if (unidadesPlantillaListas == null || unidadesPlantillaListas.length == 0) throw { 
    status: 404, message: 'Este curso no tiene unidades listas' 
  };

  const topicosPlantillaListos = await topicoPlantillaRepo.getTopicosPlantillaByCurso(id);

  if (topicosPlantillaListos == null || topicosPlantillaListos.length == 0) throw { 
    status: 404, message: 'Este curso no tiene topicos listos' 
  };

  const cursoPublicado = await cursoRepo.publicateCurso(id);

  return cursoPublicado;
};

export const deactivateCurso = async (id: number) => {
  const curso = await cursoRepo.getCursoById(id);
  if (!curso) 
    throw Object.assign(new Error('Curso no encontrado'), { status: 404 });

  const cursoArchivado = await cursoRepo.deactivateCurso(id);

  return cursoArchivado;
};