import prisma from '../config/prisma';
import {UnidadPlantilla } from '@prisma/client';
import { UnidadCreate, UnidadUpdate } from '../types/unidades.types';


export const getUnidadesByEdicion = async (id_edicion: number) => {
  return prisma.unidad.findMany({
    where : {
      id_edicion
    }
  });
};

export const getUnidadRedudante = async (id_edicion: number, titulo: string) => {
  return prisma.unidad.findFirst({
    where : {
      id_edicion,
      titulo: {
        equals: titulo,
        mode: 'insensitive', 
      },
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
  const mappedData = {
    id_edicion: data.id_edicion,
    id_unidad_plantilla: data.id_unidad_plantilla ?? null,
    titulo: data.titulo,
    descripcion: data.descripcion ?? null,
    orden: data.orden,
    icono: data.icono ?? null,
    color: data.color ?? null,
    activo: data.activo ?? true
  };
  return prisma.unidad.create({
    data: mappedData,
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

export const restoreUnidad = async (id: number) => {
  return prisma.unidad.update({
    where: { id },
    data: { 
      activo: true 
    }
  });
};

export const publicateUnidad = async (id: number) => {
  return prisma.unidad.update({
    where: { id },
    data: { 
      estado_publicado: true,
      activo: true 
    }, 
  });
};

export const deactivateUnidad = async (id: number) => {
  return prisma.unidad.update({
    where: { id },
    data: { 
      estado_publicado: false
    }, 
  });
};


export const cloneFromPlantillas = async (unidadesPlantilla: UnidadPlantilla[], id_edicion: number) => {
  if (!unidadesPlantilla || unidadesPlantilla.length === 0) return {};

  const unidadMap: Record<number, number> = {}; // { id_unidad_plantilla: id_unidad_clonada }

  await Promise.all(
    unidadesPlantilla.map(async (u) => {
      const nuevaUnidad = await prisma.unidad.create({
        data: {
          id_edicion,
          id_unidad_plantilla: u.id,
          titulo: u.titulo,
          descripcion: u.descripcion,
          orden: u.orden,
          icono: u.icono,
          color: u.color,
          activo: true,
          fecha_creacion: new Date(),
        },
      });
      unidadMap[u.id] = nuevaUnidad.id;
    })
  );

  return unidadMap;
};
