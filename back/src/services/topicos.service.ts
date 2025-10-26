import * as topicosRepository from '../repositories/topicos.repository';

export const getTopicosByUnidad = async (id_unidad: number) => {
  return await topicosRepository.getTopicosByUnidad(id_unidad);
};

export const getTopicoById = async (id: number) => {
  const topico = await topicosRepository.getTopicoById(id);

  if (!topico) {
    throw new Error('Tópico no encontrado');
  }

  return topico;
};

export const createTopico = async (data: {
  id_unidad: number;
  titulo: string;
  descripcion?: string;
  duracion_estimada: number;
  orden?: number;
  publicado?: boolean;
  objetivos_aprendizaje?: string;
  id_topico_plantilla?: number;
}) => {
  // Obtener el siguiente orden si no se proporciona
  if (data.orden === undefined) {
    const topicos = await topicosRepository.getTopicosByUnidad(data.id_unidad);
    const maxOrden = topicos.length > 0 ? Math.max(...topicos.map(t => t.orden)) : 0;
    data.orden = maxOrden + 1;
  }

  const topicoData = {
    id_unidad: data.id_unidad,
    titulo: data.titulo,
    descripcion: data.descripcion,
    duracion_estimada: data.duracion_estimada,
    orden: data.orden,
    publicado: data.publicado || false,
    objetivos_aprendizaje: data.objetivos_aprendizaje,
    activo: true,
    id_topico_plantilla: data.id_topico_plantilla,
  };

  return await topicosRepository.createTopico(topicoData);
};

export const updateTopico = async (
  id: number,
  data: {
    titulo?: string;
    descripcion?: string;
    duracion_estimada?: number;
    orden?: number;
    publicado?: boolean;
    objetivos_aprendizaje?: string;
    fecha_actualizacion?: Date;
  }
) => {
  // Verificar que el tópico existe
  const topicoExistente = await topicosRepository.getTopicoById(id);

  if (!topicoExistente) {
    throw new Error('Tópico no encontrado');
  }

  return await topicosRepository.updateTopico(id, {
    ...data,
    fecha_actualizacion: new Date(),
  });
};

export const deleteTopico = async (id: number) => {
  // Verificar que el tópico existe
  const topicoExistente = await topicosRepository.getTopicoById(id);

  if (!topicoExistente) {
    throw new Error('Tópico no encontrado');
  }

  // Verificar que esté activo
  if (!topicoExistente.activo) {
    throw new Error('El tópico ya está inactivo');
  }

  return await topicosRepository.deleteTopico(id);
};
