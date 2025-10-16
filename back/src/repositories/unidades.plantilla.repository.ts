import prisma from '../config/prisma';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../types/unidades.plantilla.types';


export const getUnidadesPlantillaByCurso = async (id: number) => {
  return prisma.unidadPlantilla.findMany({
    where : {
      id_curso: id
    }
  });
};

export const getUnidadPlantillaById = async (id: number) => {
  return prisma.unidadPlantilla.findUnique({
    where: { id },
    include: {
      curso: true
    }
  });
};

export const createUnidadPlantilla = async (data: UnidadPlantillaCreate) => {
  return prisma.unidadPlantilla.create({
    data,
  });
};

export const updateUnidadPlantilla = async (id: number, data: UnidadPlantillaUpdate) => {
  return prisma.unidadPlantilla.update({
    where: { id },
    data,
  });
};

export const deleteUnidadPlantilla = async (id: number) => {
  return prisma.unidadPlantilla.update({
    where: { id },
    data: { 
      activo: false 
    }
  });
};
