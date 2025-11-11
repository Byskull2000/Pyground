import prisma from '../config/prisma';
import { ComentarioCreate, ComentarioResponse } from '../types/comentarios.types';

const mapToComentarioResponse = (comentario: any): ComentarioResponse => ({
  id_topico: comentario.id_topico,
  id_usuario: comentario.id_usuario,
  texto: comentario.texto,
  visto: comentario.visto ?? false,
  fecha_publicacion: comentario.fecha_publicacion?.toISOString() ?? '',
});

export const getComentariosByTopico = async (id_topico: number): Promise<ComentarioResponse[]> => {
  const comentarios = await prisma.comentario.findMany({
    where: { id_topico },
    orderBy: { fecha_publicacion: 'asc' },
  });

  return comentarios.map(mapToComentarioResponse);
};

export const getComentarioById = async (id: number): Promise<ComentarioResponse | null> => {
  const comentario = await prisma.comentario.findUnique({
    where: { id },
    include: { topico: true },
  });

  return comentario ? mapToComentarioResponse(comentario) : null;
};

export const createComentario = async (data: ComentarioCreate): Promise<ComentarioResponse> => {
  const comentario = await prisma.comentario.create({ data });
  return mapToComentarioResponse(comentario);
};


export const existComentariosByIds = async (ids: number[]): Promise<number[]> => {
  const encontrados = await prisma.comentario.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });

  return encontrados.map(u => u.id);
};
