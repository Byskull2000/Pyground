import * as comentarioController from '../../controllers/comentarios.controller';
import * as comentarioService from '../../services/comentarios.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '@/utils/apiResponse';

jest.mock('../../services/comentarios.service');

describe('Comentarios Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // CREACIÓN DE COMENTARIO  (C1 - C7)
  // =========================================================================
  describe('createComentario', () => {
    const baseData = {
      id_topico: 1,
      id_usuario: 5,
      texto: 'Buen aporte'
    };

    it('C1: Creación exitosa (201)', async () => {
      const mockComentario = {
        ...baseData,
        visto: false,
        fecha_publicacion: new Date().toISOString()
      };

      (comentarioService.createComentario as jest.Mock)
        .mockResolvedValue(mockComentario);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockComentario)
      );
    });

    it('C2: No se puede publicar comentarios vacíos (400)', async () => {
      const error = { status: 400, message: 'No se puede publicar comentarios vacios' };

      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest({ ...baseData, texto: '' });
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'No se puede publicar comentarios vacios')
      );
    });

    it('C3: Falta id_topico (400)', async () => {
      const error = { status: 400, message: 'El topico es obligatorio' };

      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest({ ...baseData, id_topico: null });
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'El topico es obligatorio')
      );
    });

    it('C4: Falta id_usuario (400)', async () => {
      const error = { status: 400, message: 'Usuario no reconocido' };

      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest({ ...baseData, id_usuario: null });
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no reconocido')
      );
    });

    it('C5: Topico no encontrado (404)', async () => {
      const error = { status: 404, message: 'Topico no encontrado' };

      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Topico no encontrado')
      );
    });

    it('C6: Usuario no encontrado (404)', async () => {
      const error = { status: 404, message: 'Usuario no encontrado' };

      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no encontrado')
      );
    });

    it('C7: Error interno (500)', async () => {
      (comentarioService.createComentario as jest.Mock)
        .mockRejectedValue(new Error('Error al crear comentario'));

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al crear comentario')
      );
    });
  });

  // =========================================================================
  // GET COMENTARIOS BY TOPICO  (C8 - C13)
  // =========================================================================
  describe('getComentariosByTopico', () => {
    const baseReq = {
      id_topico: 1,
      id_usuario: 10
    };

    it('C8: Listar comentarios exitosamente (200)', async () => {
      const mockComentarios = [
        { id_topico: 1, id_usuario: 2, texto: 'Muy buen aporte', visto: false, fecha_publicacion: '2025-11-10T12:00:00Z' }
      ];

      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockResolvedValue(mockComentarios);

      const req = createMockRequest(baseReq);
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockComentarios)
      );
    });

    it('C9: Falta id_topico (400)', async () => {
      const error = { status: 400, message: 'El topico es obligatorio' };

      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest({ id_usuario: 10 });
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'El topico es obligatorio')
      );
    });

    it('C10: Falta id_usuario (400)', async () => {
      const error = { status: 400, message: 'Usuario no reconocido' };

      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest({ id_topico: 1 });
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no reconocido')
      );
    });

    it('C11: Topico no encontrado (404)', async () => {
      const error = { status: 404, message: 'Topico no encontrado' };

      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest(baseReq);
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Topico no encontrado')
      );
    });

    it('C12: Usuario no encontrado (404)', async () => {
      const error = { status: 404, message: 'Usuario no encontrado' };

      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockRejectedValue(error);

      const req = createMockRequest(baseReq);
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no encontrado')
      );
    });

    it('C13: Sin comentarios (200)', async () => {
      (comentarioService.getComentariosByTopico as jest.Mock)
        .mockResolvedValue([]);

      const req = createMockRequest(baseReq);
      const res = createMockResponse();

      await comentarioController.getComentariosByTopico(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, [])
      );
    });
  });
});
