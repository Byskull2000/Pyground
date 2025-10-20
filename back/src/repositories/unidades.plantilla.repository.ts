import prisma from '../config/prisma';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../types/unidades.plantilla.types';


export const getUnidadesPlantillaByCurso = async (id: number) => {
  return prisma.unidadPlantilla.findMany({
    where : {
      id_curso: id
    }
  });
};

export const getUnidadesPlantillaPublicadasByCurso = async (id: number) => {
  return prisma.unidadPlantilla.findMany({
    where : {
      id_curso: id,
      activo: true, 
      
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
  const mappedData = {
    id_curso: data.id_curso,
    titulo: data.titulo,
    descripcion: data.descripcion ?? null,
    orden: data.orden,
    version: data.version ?? 1,     
    icono: data.icono ?? null,
    color: data.color ?? null,
    activo: data.activo ?? true
  };

  return prisma.unidadPlantilla.create({
    data: mappedData,
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
