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


export const cloneFromPlantillas = async (unidadesPlantilla: UnidadPlantilla[], id_edicion: number) => {
  if (!unidadesPlantilla || unidadesPlantilla.length === 0) return [];

  const data = unidadesPlantilla.map((u) => ({
    id_edicion,
    id_unidad_plantilla: u.id,
    titulo: u.titulo,
    descripcion: u.descripcion,
    orden: u.orden,
    icono: u.icono,
    color: u.color,
    activo: true,
    fecha_creacion: new Date()
  }));

  return prisma.unidad.createMany({
    data,
  });
};