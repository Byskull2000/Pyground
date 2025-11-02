import * as contenidosController from '../../controllers/contenidos.controller';
import * as contenidosService from '../../services/contenidos.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';

jest.mock('../../services/contenidos.service');

enum TipoContenidoEnum {
  TEXTO = 'TEXTO',
  IMAGEN = 'IMAGEN',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  ARCHIVO = 'ARCHIVO'
}

describe('Contenidos Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContenidos', () => {
    it('CT1: Creación exitosa', async () => {
      const data = [
        { tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'Contenido 1' },
        { tipo: TipoContenidoEnum.IMAGEN, orden: 2, enlace_archivo: 'imagen.jpg' }
      ];

      const created = [{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }];

      (contenidosService.createContenidos as jest.Mock).mockResolvedValue(created);

      const req = createMockRequest({ id_topico: 1, contenidos: data });
      const res = createMockResponse();

      await contenidosController.createContenidos(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, created, 'Contenido(s) creado(s) correctamente'));
      expect(contenidosService.createContenidos).toHaveBeenCalledWith(1, data);
    });

    it('CT2: Falta id_topico', async () => {
      (contenidosService.createContenidos as jest.Mock).mockRejectedValue({ status: 400, message: 'El id_topico es obligatorio' });

      const req = createMockRequest({ id_topico: null, contenidos: [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }] });
      const res = createMockResponse();

      await contenidosController.createContenidos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El id_topico es obligatorio'));
    });

    it('CT3: No hay contenidos', async () => {
      (contenidosService.createContenidos as jest.Mock).mockRejectedValue({ status: 400, message: 'Debe incluir al menos un contenido' });

      const req = createMockRequest({ id_topico: 1, contenidos: [] });
      const res = createMockResponse();

      await contenidosController.createContenidos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Debe incluir al menos un contenido'));
    });

    it('CT4: Tópico inexistente', async () => {
      (contenidosService.createContenidos as jest.Mock).mockRejectedValue({ status: 404, message: 'Tópico no encontrado' });

      const req = createMockRequest({ id_topico: 9999, contenidos: [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }] });
      const res = createMockResponse();

      await contenidosController.createContenidos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Tópico no encontrado'));
    });
  });

  describe('updateContenido', () => {
    it('CT5: Actualización exitosa', async () => {
      const data = { orden: 2 };
      const updated = { id: 1, activo: true, ...data };

      (contenidosService.updateContenido as jest.Mock).mockResolvedValue(updated);

      const req = createMockRequest(data, { id: '1' });
      const res = createMockResponse();

      await contenidosController.updateContenido(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, updated, 'Contenido actualizado correctamente'));
      expect(contenidosService.updateContenido).toHaveBeenCalledWith(1, data);
    });

    it('CT6: Contenido inexistente', async () => {
      (contenidosService.updateContenido as jest.Mock).mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });

      const req = createMockRequest({}, { id: '9999' });
      const res = createMockResponse();

      await contenidosController.updateContenido(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Contenido no encontrado'));
    });
  });

  describe('deleteContenido', () => {
    it('CT7: Eliminación exitosa', async () => {
      const deleted = { id: 1, activo: false };
      (contenidosService.deleteContenido as jest.Mock).mockResolvedValue(deleted);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await contenidosController.deleteContenido(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, deleted, 'Contenido eliminado correctamente'));
      expect(contenidosService.deleteContenido).toHaveBeenCalledWith(1);
    });

    it('CT8: Contenido inexistente', async () => {
      (contenidosService.deleteContenido as jest.Mock).mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });

      const req = createMockRequest({}, { id: '9999' });
      const res = createMockResponse();

      await contenidosController.deleteContenido(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Contenido no encontrado'));
    });

    it('CT9: Contenido ya inactivo', async () => {
      (contenidosService.deleteContenido as jest.Mock).mockRejectedValue({ status: 400, message: 'El contenido ya está inactivo' });

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await contenidosController.deleteContenido(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El contenido ya está inactivo'));
    });
  });

  describe('getContenidosByTopico', () => {
    it('CT10: Listar contenidos de un tópico existente', async () => {
      const contenidos = [{ id: 1 }, { id: 2 }];
      (contenidosService.getContenidosByTopico as jest.Mock).mockResolvedValue(contenidos);

      const req = createMockRequest({}, { id_topico: '1' });
      const res = createMockResponse();

      await contenidosController.getContenidosByTopico(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, contenidos));
      expect(contenidosService.getContenidosByTopico).toHaveBeenCalledWith(1);
    });

    it('CT11: Tópico inexistente', async () => {
      (contenidosService.getContenidosByTopico as jest.Mock).mockRejectedValue({ status: 404, message: 'Tópico no encontrado' });

      const req = createMockRequest({}, { id_topico: '9999' });
      const res = createMockResponse();

      await contenidosController.getContenidosByTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Tópico no encontrado'));
    });
  });

  describe('getContenidoById', () => {
    it('CT12: Contenido existente', async () => {
      const contenido = { id: 1 };
      (contenidosService.getContenidoById as jest.Mock).mockResolvedValue(contenido);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await contenidosController.getContenidoById(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, contenido));
      expect(contenidosService.getContenidoById).toHaveBeenCalledWith(1);
    });

    it('CT13: Contenido inexistente', async () => {
      (contenidosService.getContenidoById as jest.Mock).mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });

      const req = createMockRequest({}, { id: '9999' });
      const res = createMockResponse();

      await contenidosController.getContenidoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Contenido no encontrado'));
    });
  });

    // REORDER CONTENIDOS
  describe('reorderContenidos', () => {
    it('CT14: Reordenamiento exitoso', async () => {
      const contenidos = [
        { id: 1, orden: 2 },
        { id: 2, orden: 1 },
        { id: 3, orden: 3 },
      ];
      (contenidosService.reorderContenidos as jest.Mock).mockResolvedValue({
        message: 'Contenidos reordenados correctamente',
        count: 3,
      });

      const req = createMockRequest(contenidos);
      const res = createMockResponse();

      await contenidosController.reorderContenidos(req, res);

      expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, { message: 'Contenidos reordenados correctamente', count: 3 }, 'Contenidos reordenados correctamente')
      );
    });

    it('CT15: Error por array vacío', async () => {
      const contenidos: any[] = [];
      (contenidosService.reorderContenidos as jest.Mock).mockRejectedValue({
        status: 400,
        message: 'Debe enviar al menos un contenido para reordenar',
      });

      const req = createMockRequest(contenidos);
      const res = createMockResponse();

      await contenidosController.reorderContenidos(req, res);

      expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Debe enviar al menos un contenido para reordenar')
      );
    });

    it('CT16: Error por contenido sin id o sin orden', async () => {
      const contenidos = [
        { id: 1 } as any, // falta orden
        { orden: 2 } as any, // falta id
      ];
      (contenidosService.reorderContenidos as jest.Mock).mockRejectedValue({
        status: 400,
        message: 'Cada contenido debe tener id y orden válidos',
      });

      const req = createMockRequest(contenidos);
      const res = createMockResponse();

      await contenidosController.reorderContenidos(req, res);

      expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Cada contenido debe tener id y orden válidos')
      );
    });

    it('CT17: Error por contenido inexistente en BD', async () => {
      const contenidos = [
        { id: 9999, orden: 1 },
        { id: 2, orden: 2 },
      ];
      (contenidosService.reorderContenidos as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Uno o más contenidos no existen',
      });

      const req = createMockRequest(contenidos);
      const res = createMockResponse();

      await contenidosController.reorderContenidos(req, res);

      expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Uno o más contenidos no existen')
      );
    });

    it('CT18: Error interno inesperado', async () => {
      const contenidos = [
        { id: 1, orden: 1 },
        { id: 2, orden: 2 },
      ];
      (contenidosService.reorderContenidos as jest.Mock).mockRejectedValue(new Error('Error interno'));

      const req = createMockRequest(contenidos);
      const res = createMockResponse();

      await contenidosController.reorderContenidos(req, res);

      expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error interno')
      );
    });
  });

});
