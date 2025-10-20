import * as topicosRepository from '../repositories/topicos.plantilla.repository';

export const getTopicosByUnidadPlantilla = async (id_unidad_plantilla: number) => {
  return await topicosRepository.getTopicosByUnidadPlantilla(id_unidad_plantilla);
};

export const getTopicoPlantillaById = async (id: number) => {
  const topico = await topicosRepository.getTopicoPlantillaById(id);
  
  if (!topico) {
    throw new Error('Tópico no encontrado');
  }
  
  return topico;
};

export const createTopicoPlantilla = async (
  id_unidad_plantilla: number,
  data: {
    titulo: string;
    descripcion?: string;
    duracion_estimada: number;
    version: number;
    objetivos_aprendizaje?: string;
  }
) => {
  // Obtener el siguiente orden
  const maxOrden = await topicosRepository.getMaxOrden(id_unidad_plantilla);
  const nuevoOrden = maxOrden + 1;

  const topicoData = {
    id_unidad_plantilla,
    titulo: data.titulo,
    descripcion: data.descripcion,
    duracion_estimada: data.duracion_estimada,
    orden: nuevoOrden,
    version: data.version,
    publicado: false,
    objetivos_aprendizaje: data.objetivos_aprendizaje,
    activo: true
  };

  return await topicosRepository.createTopicoPlantilla(topicoData);
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
  }
) => {
  // Verificar que el tópico existe
  const topicoExistente = await topicosRepository.getTopicoPlantillaById(id);
  
  if (!topicoExistente) {
    throw new Error('Tópico no encontrado');
  }

  return await topicosRepository.updateTopicoPlantilla(id, data);
};

export const deleteTopicoPlantilla = async (id: number) => {
  // Verificar que el tópico existe
  const topicoExistente = await topicosRepository.getTopicoPlantillaById(id);
  
  if (!topicoExistente) {
    throw new Error('Tópico no encontrado');
  }

  // Verificar que esté activo
  if (!topicoExistente.activo) {
    throw new Error('El tópico ya está inactivo');
  }

  return await topicosRepository.deleteTopicoPlantilla(id);
};