import { Request, Response } from 'express';
import * as cursoService from '../services/cursos.service';
import { ApiResponse } from '../utils/apiResponse';

export const getCursos = async (_req: Request, res: Response) => {
  try {
    const cursos = await cursoService.getCursos();
    res.json(new ApiResponse(true, cursos));
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status ?? 500;
    res.status(status).json(new ApiResponse(false, null, 'Error al obtener cursos'));
  }

};

export const getCursoById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const curso = await cursoService.getCursoById(id);
    if (!curso)
      return res
        .status(404)
        .json(new ApiResponse(false, null, 'Curso no encontrado'));
    res.json(new ApiResponse(true, curso));
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status ?? 500;
    res.status(status).json(new ApiResponse(false, null, 'Error al obtener curso'));
  }
};


