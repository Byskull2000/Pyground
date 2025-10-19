import prisma from '../config/prisma';

export const getAllCursos = async () => {
  return prisma.curso.findMany();
};

export const getCursoById = async (id: number) => {
  return prisma.curso.findUnique({
    where: { id }
  });
};

export const publicateCurso = async (id: number) => {
  return prisma.curso.update({
    where: { id },
    data: { 
      estado_publicado: true,
      activo: true 
    }, 
  });
};

export const deactivateCurso = async (id: number) => {
  return prisma.curso.update({
    where: { id },
    data: { 
      estado_publicado: false
    }, 
  });
};

export const deleteCurso = async (id: number) => {
  return prisma.curso.update({
    where: { id },
    data: { 
      activo: false 
    }, 
  });
};