import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import * as topicosService from '../services/topicos.service';
import * as unidadesRepository from '../repositories/unidades.repository';

export async function getTopicosByUnidad(req: Request, res: Response) {
  try {
    const id_unidad = parseInt(req.params.id_unidad);
    const unidad = await unidadesRepository.getUnidadById(id_unidad);

    if (!unidad) {
      return res.status(404).json(new ApiResponse(false, null, 'Unidad no encontrada'));
    }

    const topicos = await topicosService.getTopicosByUnidad(id_unidad);
    return res.json(new ApiResponse(true, topicos));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al obtener los tópicos'));
  }
}

export async function getTopicoById(req: Request, res: Response) {
  try {
    const idStr = req.params.id;

    if (!idStr || isNaN(Number(idStr))) {
      return res.status(400).json(
        new ApiResponse(false, null, 'ID de tópico inválido')
      );
    }

    const id = parseInt(idStr);
    const topico = await topicosService.getTopicoById(id);
    return res.json(new ApiResponse(true, topico));
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === 'Tópico no encontrado') {
      return res.status(404).json(new ApiResponse(false, null, err.message));
    }
    return res.status(500).json(new ApiResponse(false, null, 'Error al obtener el tópico'));
  }
}

export async function createTopico(req: Request, res: Response) {
  try {
    const id_unidad = parseInt(req.params.id_unidad);
    const { titulo, descripcion, duracion_estimada, orden, publicado, objetivos_aprendizaje, id_topico_plantilla } = req.body;

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

    // Verificar que la unidad existe
    const unidad = await unidadesRepository.getUnidadById(id_unidad);
    if (!unidad) {
      return res.status(404).json(new ApiResponse(false, null, 'Unidad no encontrada'));
    }

    const newTopico = await topicosService.createTopico({
      id_unidad,
      titulo,
      descripcion,
      duracion_estimada,
      orden,
      publicado,
      objetivos_aprendizaje,
      id_topico_plantilla,
    });

    return res.status(201).json(new ApiResponse(true, newTopico));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(false, null, 'Error al crear el tópico'));
  }
}

export async function updateTopico(req: Request, res: Response) {
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

    const updatedTopico = await topicosService.updateTopico(id, {
      titulo,
      descripcion,
      duracion_estimada,
      orden,
      publicado,
      objetivos_aprendizaje,
    });

    return res.json(new ApiResponse(true, updatedTopico));
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === 'Tópico no encontrado') {
      return res.status(404).json(new ApiResponse(false, null, err.message));
    }
    return res.status(500).json(new ApiResponse(false, null, 'Error al actualizar el tópico'));
  }
}

export async function deleteTopico(req: Request, res: Response) {
  try {
    const idStr = req.params.id;
    if (!idStr || isNaN(Number(idStr))) {
      return res.status(400).json(
        new ApiResponse(false, null, 'ID de tópico inválido')
      );
    }

    const id = parseInt(idStr);

    const deletedTopico = await topicosService.deleteTopico(id);

    return res.json(new ApiResponse(true, deletedTopico, 'Tópico eliminado correctamente'));
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message.includes('no encontrado')) {
      return res.status(404).json(new ApiResponse(false, null, err.message));
    }
    return res.status(500).json(new ApiResponse(false, null, 'Error al eliminar el tópico'));
  }
}

export const reorderTopicos = async (req: Request, res: Response) => {
  try {
    const topicos = req.body; 
    const result = await topicosService.reorderTopicos(topicos);
    return res.json(new ApiResponse(true, result, 'Topicos reordenados correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al reordenar topicos';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};
