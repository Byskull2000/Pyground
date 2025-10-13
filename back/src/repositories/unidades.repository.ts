import prisma from '../config/prisma';
import { Unidad } from '@prisma/client';
import { UnidadCreate, UnidadUpdate } from '../types/unidades.types';


export const getUnidadesByEdicion = async (id_edicion: number) => {
  return prisma.unidad.findMany({
    where : {
      id_edicion
    }
  });
};

export const getUnidadById = async (id: number) => {
  return prisma.unidad.findUnique({
    where: { id },
    include: {
      edicion: true
    }
  });
};

export const createUnidad = async (data: UnidadCreate) => {
  return prisma.unidad.create({
    data,
  });
};

export const updateUnidad = async (id: number, data: UnidadUpdate) => {
  return prisma.unidad.update({
    where: { id },
    data,
  });
};

export const deleteUnidad = async (id: number) => {
  return prisma.unidad.update({
    where: { id },
    data: { 
      activo: false 
    }
  });
};
