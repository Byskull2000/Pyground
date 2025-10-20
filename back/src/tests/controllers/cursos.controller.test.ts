import * as cursoController from '../../controllers/cursos.controller';
import * as cursoService from '../../services/cursos.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '@/utils/apiResponse';

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

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockCursos)
      );
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
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al obtener cursos')
      );
    });
  });

  describe('getCursoById', () => {
    it('debe retornar un curso por id existente (VC1)', async () => {
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

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockCurso)
      );
      expect(cursoService.getCursoById).toHaveBeenCalledWith(1);
    });

    it('debe retornar 404 si el curso no existe (VC2)', async () => {
      (cursoService.getCursoById as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await cursoController.getCursoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Curso no encontrado')
      );
    });
    
    it('debe retornar 500 si hay error del servidor (VC5)', async () => {
      (cursoService.getCursoById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await cursoController.getCursoById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Error al obtener curso'));
    });
  });


  describe('publicateCurso', () => {
    it('PC1 - debe publicar un curso correctamente', async () => {
      (cursoService.publicateCurso as jest.Mock).mockResolvedValue({});

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await cursoController.publicateCurso(req, res);

      expect(cursoService.publicateCurso).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, { message: 'Curso publicado correctamente' })
      );
    });

    it('PC2 - debe retornar 404 si el curso no existe', async () => {
      (cursoService.publicateCurso as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Curso no encontrado',
      });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await cursoController.publicateCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Curso no encontrado')
      );
    });

    it('PC3 - debe retornar 500 si ocurre un error inesperado', async () => {
      (cursoService.publicateCurso as jest.Mock).mockRejectedValue(
        new Error('Error inesperado')
      );

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await cursoController.publicateCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error inesperado')
      );
    });
  });

  describe('deactivateCurso', () => {
    it('DC1 - debe archivar un curso correctamente', async () => {
      (cursoService.deactivateCurso as jest.Mock).mockResolvedValue({});

      const req = createMockRequest({}, { id: '2' });
      const res = createMockResponse();

      await cursoController.deactivateCurso(req, res);

      expect(cursoService.deactivateCurso).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, { message: 'Curso archivado' })
      );
    });

    it('DC2 - debe retornar 404 si el curso no existe', async () => {
      (cursoService.deactivateCurso as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Curso no encontrado',
      });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await cursoController.deactivateCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Curso no encontrado')
      );
    });

    it('DC3 - debe retornar 500 si ocurre un error inesperado', async () => {
      (cursoService.deactivateCurso as jest.Mock).mockRejectedValue(
        new Error('Error inesperado')
      );

      const req = createMockRequest({}, { id: '3' });
      const res = createMockResponse();

      await cursoController.deactivateCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error inesperado')
      );
    });
  });
});
