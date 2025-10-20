import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import * as topicosPlantillaRepository from '../repositories/topicos.plantilla.repository';
import * as unidadesPlantillaRepository from '../repositories/unidades.plantilla.repository';

export async function getTopicosByUnidadPlantilla(req: Request, res: Response) {
  try {
    const id_unidad_plantilla = parseInt(req.params.id_unidad_plantilla);
    const unidadPlantilla = await unidadesPlantillaRepository.getUnidadPlantillaById(id_unidad_plantilla);
    
    if (!unidadPlantilla) {
      return res.status(404).json(new ApiResponse(false, null, 'Unidad plantilla no encontrada'));
    }

    const topicos = await topicosPlantillaRepository.getTopicosByUnidadPlantilla(id_unidad_plantilla);
    return res.json(new ApiResponse(true, topicos));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al obtener los tópicos'));
  }
}

export async function createTopicoPlantilla(req: Request, res: Response) {
  try {
    const id_unidad_plantilla = parseInt(req.params.id_unidad_plantilla);
    const { titulo, descripcion, duracion_estimada, objetivos_aprendizaje } = req.body;

    // Validaciones
    if (!titulo || !duracion_estimada) {
  return res.status(400).json(
    new ApiResponse(false, null, 'Título y duración estimada son requeridos')
  );
}


if (duracion_estimada <= 0) {
  return res.status(400).json(
    new ApiResponse(false, null, 'La duración estimada debe ser mayor a 0')
  );
}

    // Verificar que la unidad plantilla existe
    const unidadPlantilla = await unidadesPlantillaRepository.getUnidadPlantillaById(id_unidad_plantilla);
    if (!unidadPlantilla) {
      return res.status(404).json(new ApiResponse(false, null, 'Unidad plantilla no encontrada'));
    }

    // Obtener el orden máximo actual
    const maxOrden = await topicosPlantillaRepository.getMaxOrden(id_unidad_plantilla);

    const newTopico = await topicosPlantillaRepository.createTopicoPlantilla({
      id_unidad_plantilla,
      titulo,
      descripcion,
      duracion_estimada,
      orden: maxOrden + 1,
      version: 1,
      objetivos_aprendizaje,
      activo: true,
    });

    return res.status(201).json(new ApiResponse(true, newTopico));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al crear el tópico'));
  }
}

export async function updateTopicoPlantilla(req: Request, res: Response) {
  try {
    const idStr = req.params.id;

    if (!idStr || isNaN(Number(idStr))) {
      return res.status(400).json(
        new ApiResponse(false, null, 'ID de tópico inválido')
      );
    }

    const id = parseInt(idStr);
    const { titulo, descripcion, duracion_estimada, orden, publicado, objetivos_aprendizaje } = req.body;


    if (!titulo && !descripcion && duracion_estimada === undefined && 
        orden === undefined && publicado === undefined && !objetivos_aprendizaje) {
      return res.status(400).json(
        new ApiResponse(false, null, 'No hay datos para actualizar')
      );
    }

    const topicoExistente = await topicosPlantillaRepository.getTopicoPlantillaById(id);
    if (!topicoExistente) {
      return res.status(404).json(
        new ApiResponse(false, null, 'Tópico no encontrado')
      );
    }

    const updatedTopico = await topicosPlantillaRepository.updateTopicoPlantilla(id, {
      titulo,
      descripcion,
      duracion_estimada,
      orden,
      version: topicoExistente.version + 1,
      publicado,
      objetivos_aprendizaje,
    });

    return res.json(new ApiResponse(true, updatedTopico));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al actualizar el tópico'));
  }
}

export async function deleteTopicoPlantilla(req: Request, res: Response) {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(Number(idStr))) {
      return res.status(400).json(
        new ApiResponse(false, null, 'ID de tópico inválido')
      );
    }

    const id = parseInt(idStr);

    const topicoExistente = await topicosPlantillaRepository.getTopicoPlantillaById(id);
    if (!topicoExistente) {
       return res.status(404).json(
        new ApiResponse(false, null, 'Tópico no encontrado')
      );
    }

    const deletedTopico = await topicosPlantillaRepository.deleteTopicoPlantilla(id);

 return res.json(new ApiResponse(true, deletedTopico, 'Tópico plantilla eliminado correctamente'));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al eliminar el tópico'));
  }
}
