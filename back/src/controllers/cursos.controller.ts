import { Request, Response } from 'express';
import * as cursoService from '../services/cursos.service';

export const getCursos = async (_req: Request, res: Response) => {
  try {
    const cursos = await cursoService.getCursos();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

export const getCursoById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const curso = await cursoService.getCursoById(id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(curso);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener curso' });
  }
};


