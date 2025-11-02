import prisma from '../config/prisma';
import {TopicoPlantilla } from '@prisma/client';
import { TopicoCreate, TopicoReorganize, TopicoUpdate } from '../types/topicos.types';


export const getTopicosByUnidad = async (id_unidad: number) => {
  return prisma.topico.findMany({
    where : {
      id_unidad
    }
  });
};

export const getTopicoById = async (id: number) => {
  return prisma.topico.findUnique({
    where: { id },
    include: {
      unidad: true
    }
  });
};

export const createTopico = async (data: TopicoCreate) => {
  return prisma.topico.create({
    data,
  });
};

export const updateTopico = async (id: number, data: TopicoUpdate) => {
  return prisma.topico.update({
    where: { id },
    data,
  });
};

export const deleteTopico = async (id: number) => {
  return prisma.topico.update({
    where: { id },
    data: { 
      activo: false 
    }
  });
};
export const cloneTopicosFromPlantillas = async (
  topicosPlantilla: TopicoPlantilla[],
  unidadMap: Record<number, number> // { id_unidad_plantilla: id_unidad_clonada }
) => {
  if (!topicosPlantilla?.length) return [];

  const data = topicosPlantilla
    .map(t => {
      const id_unidad = unidadMap[t.id_unidad_plantilla];
      if (!id_unidad) return null; 
      return {
        id_unidad,
        id_topico_plantilla: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion,
        duracion_estimada: t.duracion_estimada,
        orden: t.orden,
        publicado: t.publicado,
        objetivos_aprendizaje: t.objetivos_aprendizaje,
        activo: true,
        fecha_creacion: new Date(),
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null); 

  if (!data.length) return [];

  return prisma.topico.createMany({
    data,
  });
};

export const reorderTopicos = async (topicos: TopicoReorganize[]) => {
  return prisma.$transaction(
    topicos.map(u =>
      prisma.topico.update({
        where: { id: u.id },
        data: { orden: u.orden, fecha_actualizacion: new Date() },
      })
    )
  );
};

export const existTopicosByIds = async (ids: number[]) => {
  const encontrados = await prisma.topico.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  return encontrados.map(u => u.id);
};