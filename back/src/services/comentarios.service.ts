import * as comentariosRepository from '../repositories/comentarios.repository';
import { ComentarioCreate, ComentarioResponse, ComentarioRequest} from '../types/comentarios.types';

export const getComentariosByTopico = async (request: ComentarioRequest): Promise<ComentarioResponse[]> => {
  return await comentariosRepository.getComentariosByTopico(request);
};

export const createComentario = async (data: ComentarioCreate): Promise<ComentarioResponse> => {
  if (!data.texto || !data.id_topico || !data.id_usuario) {
    throw new Error('Faltan datos obligatorios para crear el comentario');
  }

  return await comentariosRepository.createComentario(data);
};
