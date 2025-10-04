import { Request, Response } from 'express';
import * as cursoController from '../../controllers/cursos.controller';
import * as cursoService from '../../services/cursos.service';
import { createMockRequest, createMockResponse } from '../setup';

jest.mock('../../services/cursos.service');

describe('Cursos Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCursos', () => {
    it('debe retornar lista de cursos con status 200', async () => {
      const mockCursos = [
        {
          id: 1,
          nombre: 'Python',
          codigo_curso: 'PYT001',
          descripcion: null,
          activo: true,
          fecha_creacion: new Date(),
          creado_por: null
        },
        {
          id: 2,
          nombre: 'Java',
          codigo_curso: 'JAV002',
          descripcion: null,
          activo: true,
          fecha_creacion: new Date(),
          creado_por: null
        }
      ];


      (cursoService.getCursos as jest.Mock).mockResolvedValue(mockCursos);

      const req = createMockRequest();
      const res = createMockResponse();

      await cursoController.getCursos(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCursos);
      expect(cursoService.getCursos).toHaveBeenCalled();
    });

    it('debe retornar error 500 cuando falla el servicio', async () => {
      (cursoService.getCursos as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const req = createMockRequest();
      const res = createMockResponse();

      await cursoController.getCursos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener cursos'
      });
    });
  });

  describe('getCursoById', () => {
    it('debe retornar un curso por id', async () => {
      const mockCurso = {
        id: 1,
        nombre: 'JAVA',
        codigo_curso: 'JAV001',
        descripcion: null,
        activo: true,
        fecha_creacion: new Date(),
        creado_por: null
      };

      (cursoService.getCursoById as jest.Mock).mockResolvedValue(mockCurso);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await cursoController.getCursoById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCurso);
      expect(cursoService.getCursoById).toHaveBeenCalledWith(1);
    });

    it('debe retornar 404 si el curso no existe', async () => {
      (cursoService.getCursoById as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await cursoController.getCursoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });
  });
});
