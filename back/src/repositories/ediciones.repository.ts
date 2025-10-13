import prisma from '../config/prisma';
import { Edicion } from '@prisma/client';
import { EdicionCreate, EdicionUpdate } from '../types/ediciones.types';


export const getEdicionesByCurso = async (id: number) => {
  return prisma.edicion.findMany({
    where: { 
      activo: true,
      id_curso: id
    }
  });
};

export const getEdicionesByCursoAndNombre = async (id: number, nombre: string) => {
  return prisma.edicion.findMany({
    where: { 
      activo: true,
      id_curso: id,
      nombre_edicion: nombre
    }
  });
};

export const getEdicionById = async (id: number) => {
  return prisma.edicion.findUnique({
    where: { id },
    include: {
      unidades: true,
      curso: true
    }
  });
};

export const createEdicion = async (data: EdicionCreate) => {
  return prisma.edicion.create({
    data,
    include: {
      unidades: true
    }
  });
};

export const updateEdicion = async (id: number, data: EdicionUpdate) => {
  return prisma.edicion.update({
    where: { id },
    data,
    include: {
      unidades: true
    }
  });
};

export const deleteEdicion = async (id: number) => {
  return prisma.edicion.update({
    where: { id },
    data: { 
      activo: false 
    }, 
  });
};
