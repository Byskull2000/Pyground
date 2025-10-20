import prisma from '../config/prisma';

export const getTopicosByUnidadPlantilla = async (id_unidad_plantilla: number) => {
  return prisma.topicoPlantilla.findMany({
    where: {
      id_unidad_plantilla,
      activo: true,
    },
    orderBy: {
      orden: 'asc',
    },
  });
};

export const getTopicosPlantillaByCurso = async (id_curso: number) => {
  return prisma.topicoPlantilla.findMany({
    where: {
      unidadPlantilla:{
        id_curso: id_curso,
      },
      activo: true,
    },
    orderBy: {
      orden: 'asc',
    },
  });
};

export const getTopicoPlantillaById = async (id: number) => {
  return prisma.topicoPlantilla.findUnique({
    where: { id },
  });
};

export const createTopicoPlantilla = async (data: {
  id_unidad_plantilla: number;
  titulo: string;
  descripcion?: string;
  duracion_estimada: number;
  orden: number;
  version: number;
  publicado?: boolean;
  objetivos_aprendizaje?: string;
  activo?: boolean;
}) => {
  return prisma.topicoPlantilla.create({
    data,
  });
};

export const updateTopicoPlantilla = async (
  id: number,
  data: {
    titulo?: string;
    descripcion?: string;
    duracion_estimada?: number;
    orden?: number;
    version?: number;
    publicado?: boolean;
    objetivos_aprendizaje?: string;
    activo?: boolean;
  },
) => {
  return prisma.topicoPlantilla.update({
    where: { id },
    data,
  });
};

export const deleteTopicoPlantilla = async (id: number) => {
  return prisma.topicoPlantilla.update({
    where: { id },
    data: { activo: false },
  });
};

export const getMaxOrden = async (id_unidad_plantilla: number): Promise<number> => {
  const result = await prisma.topicoPlantilla.findFirst({
    where: {
      id_unidad_plantilla,
      activo: true,
    },
    orderBy: {
      orden: 'desc',
    },
    select: {
      orden: true,
    },
  });

  return result?.orden ?? 0;
};
