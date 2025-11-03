import { Request, Response } from 'express';
import * as contenidosService from '../services/contenidos.service';
import { ApiResponse } from '../utils/apiResponse';

export const getContenidosByTopico = async (req: Request, res: Response) => {
  try {
    const id_topico = parseInt(req.params.id_topico);
    const contenidos = await contenidosService.getContenidosByTopico(id_topico);
    return res.json(new ApiResponse(true, contenidos));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener contenidos';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getContenidoById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const contenido = await contenidosService.getContenidoById(id);
    return res.json(new ApiResponse(true, contenido));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener el contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createContenidos = async (req: Request, res: Response) => {
  try {
    const id_topico = parseInt(req.body.id_topico);
    const contenidos = req.body.contenidos;
    const newContenidos = await contenidosService.createContenidos(id_topico, contenidos);
    return res.status(201).json(new ApiResponse(true, newContenidos, 'Contenido(s) creado(s) correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateContenido = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedContenido = await contenidosService.updateContenido(id, data);
    return res.json(new ApiResponse(true, updatedContenido, 'Contenido actualizado correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteContenido = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedContenido = await contenidosService.deleteContenido(id);
    return res.json(new ApiResponse(true, deletedContenido, 'Contenido eliminado correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar contenido';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const reorderContenidos = async (req: Request, res: Response) => {
  try {
    const contenidos = req.body;
    const result = await contenidosService.reorderContenidos(contenidos);
    return res.json(new ApiResponse(true, result, 'Contenidos reordenados correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al reordenar contenidos';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json(new ApiResponse(false, null, 'No se encontraron archivos'));
    }

    const files = req.files as Express.Multer.File[];
    const fileUrls = files.map(file => `/uploads/${file.filename}`);

    return res.json(new ApiResponse(true, { urls: fileUrls }, 'Archivos subidos correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const message = (err as { message?: string })?.message ?? 'Error al subir archivos';
    return res.status(500).json(new ApiResponse(false, null, message));
  }
};

export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(false, null, 'No se encontró el archivo'));
    }

    const file = req.file as Express.Multer.File;
    const fileUrl = `/uploads/${file.filename}`;

    return res.json(new ApiResponse(true, { url: fileUrl }, 'Archivo subido correctamente'));
  } catch (err: unknown) {
    console.error(err);
    const message = (err as { message?: string })?.message ?? 'Error al subir archivo';
    return res.status(500).json(new ApiResponse(false, null, message));
  }
};
