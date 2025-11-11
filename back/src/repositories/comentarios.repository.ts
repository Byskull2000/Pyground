import prisma from '../config/prisma';
import { ComentarioCreate, ComentarioResponse, ComentarioRequest } from '../types/comentarios.types';


export const getComentariosByTopico = async (
  request: ComentarioRequest
): Promise<ComentarioResponse[]> => {
  const { id_topico, id_usuario } = request;

  const comentarios = await prisma.comentario.findMany({
    where: { id_topico },
    orderBy: { fecha_publicacion: 'asc' },
    include: {
      vistos: {
        where: { id_usuario },
        select: { fue_visto: true },
      },
    },
  });

  const idsComentarios = comentarios.map(c => c.id);
  const vistasExistentes = await prisma.visto.findMany({
    where: {
      id_usuario,
      id_comentario: { in: idsComentarios },
    },
    select: { id_comentario: true },
  });
  const idsYaVistos = vistasExistentes.map(v => v.id_comentario);
  const idsNoVistos = idsComentarios.filter(id => !idsYaVistos.includes(id));

  if (idsNoVistos.length > 0) {
    await prisma.visto.createMany({
      data: idsNoVistos.map(id_comentario => ({
        id_usuario,
        id_comentario,
        fue_visto: true,
      })),
    });
  }

  return comentarios.map(c =>
    mapToComentarioResponse({
      ...c,
      visto: c.vistos.length > 0,
    })
  );
};


export const getComentarioById = async (
  id: number,
  id_usuario: number
): Promise<ComentarioResponse | null> => {
  const comentario = await prisma.comentario.findUnique({
    where: { id },
    include: {
      vistos: {
        where: { id_usuario },
        select: { fue_visto: true },
      },
    },
  });

  if (!comentario) return null;

  if (comentario.vistos.length === 0) {
    await prisma.visto.create({
      data: {
        id_comentario: comentario.id,
        id_usuario,
        fue_visto: true,
      },
    });
  }

  return mapToComentarioResponse({
    ...comentario,
    visto: comentario.vistos.length > 0,
  });
};

export const createComentario = async (data: ComentarioCreate): Promise<ComentarioResponse> => {
  const comentario = await prisma.comentario.create({ data });
  return mapToComentarioResponse(comentario);
};

const mapToComentarioResponse = (comentario: any): ComentarioResponse => ({
  id_topico: comentario.id_topico,
  id_usuario: comentario.id_usuario,
  texto: comentario.texto,
  visto: comentario.visto ?? false,
  fecha_publicacion: comentario.fecha_publicacion?.toISOString() ?? '',
});