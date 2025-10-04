import * as cursoRepo from '../repositories/cursos.repository';
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
    creado_por: c.creado_por
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
