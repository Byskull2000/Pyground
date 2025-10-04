import prisma from '../config/prisma';

export const getAllCursos = async () => {
  return prisma.curso.findMany();
};

export const getCursoById = async (id: number) => {
  return prisma.curso.findUnique({
    where: { id }
  });
};


