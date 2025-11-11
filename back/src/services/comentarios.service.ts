import * as comentariosRepository from '../repositories/comentarios.repository';
import * as usuariosRepository from '../repositories/usuarios.repository';
import * as topicosRepository from '../repositories/topicos.repository';

import { ComentarioCreate, ComentarioResponse, ComentarioRequest} from '../types/comentarios.types';

export const getComentariosByTopico = async (data: ComentarioRequest): Promise<ComentarioResponse[]> => {
  if (!data.id_topico) throw { status: 400, message: 'El topico es obligatorio' };
  if (!data.id_usuario) throw { status: 400, message: 'Usuario no reconocido' };
  if (await topicosRepository.getTopicoById(data.id_topico) == null) throw { status: 404, message: 'Topico no encontrado' };
  if (await usuariosRepository.getUsuarioById(data.id_usuario) == null) throw { status: 404, message: 'Usuario no encontrado' };

  return await comentariosRepository.getComentariosByTopico(data);
};

export const createComentario = async (data: ComentarioCreate): Promise<ComentarioResponse> => {
  if (!data.texto) throw { status: 400, message: 'No se puede publicar comentarios vacios' };
  if (!data.id_topico) throw { status: 400, message: 'El topico es obligatorio' };
  if (!data.id_usuario) throw { status: 400, message: 'Usuario no reconocido' };
  if (await topicosRepository.getTopicoById(data.id_topico) == null) throw { status: 404, message: 'Topico no encontrado' };
  if (await usuariosRepository.getUsuarioById(data.id_usuario) == null) throw { status: 404, message: 'Usuario no encontrado' };

  if (!data.texto || !data.id_topico || !data.id_usuario) {
    throw new Error('Faltan datos obligatorios para crear el comentario');
  }

  return await comentariosRepository.createComentario(data);
};
