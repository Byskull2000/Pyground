import * as contenidosRepo from '../repositories/contenidos.repository';
import * as topicosRepo from '../repositories/topicos.repository';
import { ContenidoCreate } from '../types/contenidos.types';

export const getContenidosByTopico = async (id_topico: number) => {
  const topico = await topicosRepo.getTopicoById(id_topico);
  if (!topico) throw { status: 404, message: 'Tópico no encontrado' };

  return contenidosRepo.getContenidosByTopico(id_topico);
};

export const getContenidoById = async (id: number) => {
  const contenido = await contenidosRepo.getContenidoById(id);
  if (!contenido) throw { status: 404, message: 'Contenido no encontrado' };
  return contenido;
};


export const createContenidos = async (id_topico: number, contenidos: ContenidoCreate[]) => {
  if (!id_topico) throw { status: 400, message: 'El id_topico es obligatorio' };
  if (!contenidos || contenidos.length === 0) throw { status: 400, message: 'Debe incluir al menos un contenido' };

  const topico = await topicosRepo.getTopicoById(id_topico);
  if (!topico) throw { status: 404, message: 'Tópico no encontrado' };

  return contenidosRepo.createContenidos({ id_topico, contenidos });
};


export const updateContenido = async (id: number, data: Partial<ContenidoCreate> & { activo?: boolean }) => {
  const contenido = await contenidosRepo.getContenidoById(id);
  if (!contenido) throw { status: 404, message: 'Contenido no encontrado' };

  return contenidosRepo.updateContenido(id, data);
};


export const deleteContenido = async (id: number) => {
  const contenido = await contenidosRepo.getContenidoById(id);
  if (!contenido) throw { status: 404, message: 'Contenido no encontrado' };
  if (!contenido.activo) throw { status: 400, message: 'El contenido ya está inactivo' };

  return contenidosRepo.deleteContenido(id);
};
