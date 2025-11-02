import prisma from '../config/prisma';
import { ContenidoUpdate, ContenidosCreate, ContenidoReorganize } from '../types/contenidos.types';

export const createContenidos = async (data: ContenidosCreate) => {
  return prisma.contenido.createMany({
    data: data.contenidos.map(c => ({
      id_topico: data.id_topico,
      tipo: c.tipo,
      orden: c.orden,
      titulo: c.titulo,
      descripcion: c.descripcion,
      texto: c.texto,
      enlace_archivo: c.enlace_archivo,
    })),
  });
};

export const getContenidosByTopico = async (id_topico: number) => {
  return prisma.contenido.findMany({
    where: { id_topico, activo: true },
    orderBy: { orden: 'asc' },
  });
};

export const getContenidoById = async (id: number) => {
  return prisma.contenido.findUnique({
    where: { id },
  });
};

export const updateContenido = async (id: number, data: ContenidoUpdate) => {
  return prisma.contenido.update({
    where: { id },
    data,
  });
};

export const deleteContenido = async (id: number) => {
  return prisma.contenido.update({
    where: { id },
    data: { activo: false },
  });
};

export const reorderContenidos = async (contenidos: ContenidoReorganize[]) => {
  return prisma.$transaction(
    contenidos.map(u =>
      prisma.contenido.update({
        where: { id: u.id },
        data: { orden: u.orden, fecha_actualizacion: new Date() },
      })
    )
  );
};

export const existContenidosByIds = async (ids: number[]) => {
  const encontrados = await prisma.contenido.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  return encontrados.map(u => u.id);
};