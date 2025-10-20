import { Request, Response } from 'express';
import * as inscripcionService from '../services/inscripciones.service';
import { ApiResponse } from '../utils/apiResponse';

export const getInscripcionesByEdicion = async (req: Request, res: Response) => {
  try {
    const id_edicion = parseInt(req.params.id_edicion);
    const inscripciones = await inscripcionService.getInscripcionesByEdicion(id_edicion);
    return res.json(new ApiResponse(true, inscripciones));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener inscripciones';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getInscrip = async (req: Request, res: Response) => {
  try {
    const id_edicion = parseInt(req.params.id_edicion);
    const inscripciones = await inscripcionService.getInscripcionesByEdicion(id_edicion);
    return res.json(new ApiResponse(true, inscripciones));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener inscripciones';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getInscripcionesByUsuario = async (req: Request, res: Response) => {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    const inscripciones = await inscripcionService.getInscripcionesByUsuario(id_usuario);
    return res.json(new ApiResponse(true, inscripciones));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener inscripciones';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getInscripcion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const inscripcion = await inscripcionService.getInscripcion(id);
    return res.json(new ApiResponse(true, inscripcion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener la inscripción';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const getInscripcionStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const id_edicion = parseInt(req.params.id_edicion);
    const inscripcion = await inscripcionService.getInscripcionStatus(id, id_edicion);
    return res.json(new ApiResponse(true, inscripcion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al obtener la inscripción';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const createInscripcion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const nuevaInscripcion = await inscripcionService.createInscripcion(data);
    return res.status(201).json(new ApiResponse(true, nuevaInscripcion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al crear la inscripción';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const updateInscripcion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedInscripcion = await inscripcionService.updateInscripcion(id, data);
    return res.json(new ApiResponse(true, updatedInscripcion));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al actualizar la inscripción';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};

export const deleteInscripcion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await inscripcionService.deleteInscripcion(id);
    return res.json(new ApiResponse(true, { message: 'Inscripción eliminada correctamente' }));
  } catch (err: unknown) {
    console.error(err);
    const status = (err as { status?: number })?.status ?? 500;
    const message = (err as { message?: string })?.message ?? 'Error al eliminar la inscripción';
    return res.status(status).json(new ApiResponse(false, null, message));
  }
};
