import * as unidadController from '../../controllers/unidades.controller';
import * as unidadService from '../../services/unidades.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';
import { UnidadCreate, UnidadReorganize, UnidadUpdate } from '../../types/unidades.types';

jest.mock('../../services/unidades.service');

describe('Unidad Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE UNIDAD
  describe('createUnidad', () => {
    const baseData: UnidadCreate = { id_edicion: 1, titulo: 'Introducción', orden: 1 };

    it('U1: Creación exitosa de una unidad', async () => {
      const mockNueva = { id: 10, ...baseData, activo: true, estado_publicado: false };
      (unidadService.createUnidad as jest.Mock).mockResolvedValue(mockNueva);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockNueva));
      expect(unidadService.createUnidad).toHaveBeenCalledWith(baseData);
    });

    it('U2: Faltan campos obligatorios: título', async () => {
      (unidadService.createUnidad as jest.Mock).mockRejectedValue({ status: 400, message: 'El título es obligatorio' });

      const req = createMockRequest({ ...baseData, titulo: '' });
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El título es obligatorio'));
    });

    it('U3: Faltan campos obligatorios: id_edicion', async () => {
      (unidadService.createUnidad as jest.Mock).mockRejectedValue({ status: 400, message: 'La edición es obligatoria' });

      const req = createMockRequest({ ...baseData, id_edicion: null });
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La edición es obligatoria'));
    });

    it('U4: Faltan campos obligatorios: orden', async () => {
      (unidadService.createUnidad as jest.Mock).mockRejectedValue({ status: 400, message: 'El orden es obligatorio' });

      const req = createMockRequest({ ...baseData, orden: null });
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El orden es obligatorio'));
    });

    it('U5: Unidad duplicada en la misma edición', async () => {
      (unidadService.createUnidad as jest.Mock).mockRejectedValue({ status: 409, message: 'Ya existe una unidad con este titulo en este unidad' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Ya existe una unidad con este titulo en este unidad'));
    });

    it('U6: Error interno del repositorio', async () => {
      // El controller devuelve el message provisto en el error (fallback 'Error al crear unidad').
      (unidadService.createUnidad as jest.Mock).mockRejectedValue({ status: 500, message: 'Error al crear la unidad' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadController.createUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Error al crear la unidad'));
    });
  });

  // UPDATE UNIDAD
  describe('updateUnidad', () => {
    const updateData: UnidadUpdate = { titulo: 'Nuevo Título' };

    it('U7: Actualización exitosa', async () => {
      const updatedUnidad = { id: 1, id_edicion: 1, titulo: 'Nuevo Título', activo: true };
      (unidadService.updateUnidad as jest.Mock).mockResolvedValue(updatedUnidad);

      const req = createMockRequest(updateData, { id: '1' });
      const res = createMockResponse();

      await unidadController.updateUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, updatedUnidad));
      expect(unidadService.updateUnidad).toHaveBeenCalledWith(1, updateData);
    });

    it('U8: Unidad inexistente', async () => {
      (unidadService.updateUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest(updateData, { id: '999' });
      const res = createMockResponse();

      await unidadController.updateUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // DELETE UNIDAD
  describe('deleteUnidad', () => {
    it('U9: Eliminación exitosa', async () => {
      (unidadService.deleteUnidad as jest.Mock).mockResolvedValue({ id: 1, activo: false });

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadController.deleteUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidad eliminada correctamente' }));
      expect(unidadService.deleteUnidad).toHaveBeenCalledWith(1);
    });

    it('U10: Unidad inexistente', async () => {
      (unidadService.deleteUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadController.deleteUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // RESTORE UNIDAD
  describe('restoreUnidad', () => {
    it('U11: Restauración exitosa', async () => {
      // controller devuelve mensaje; service mocked to resolve any value
      (unidadService.restoreUnidad as jest.Mock).mockResolvedValue({ id: 1, activo: true });

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadController.restoreUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidad restaurada correctamente' }));
      expect(unidadService.restoreUnidad).toHaveBeenCalledWith(1);
    });

    it('U12: Unidad inexistente', async () => {
      (unidadService.restoreUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadController.restoreUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // PUBLICATE UNIDAD
  describe('publicateUnidad', () => {
    it('U13: Publicación exitosa', async () => {
      (unidadService.publicateUnidad as jest.Mock).mockResolvedValue({ id: 1, estado_publicado: true });

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadController.publicateUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidad publicada correctamente' }));
      expect(unidadService.publicateUnidad).toHaveBeenCalledWith(1);
    });

    it('U14: Unidad inexistente', async () => {
      (unidadService.publicateUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadController.publicateUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // DEACTIVATE UNIDAD
  describe('deactivateUnidad', () => {
    it('U15: Desactivación exitosa', async () => {
      (unidadService.deactivateUnidad as jest.Mock).mockResolvedValue({ id: 1, estado_publicado: false });

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadController.deactivateUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidad archivada correctamente' }));
      expect(unidadService.deactivateUnidad).toHaveBeenCalledWith(1);
    });

    it('U16: Unidad inexistente', async () => {
      (unidadService.deactivateUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadController.deactivateUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // GET UNIDADES BY EDICION
  describe('getUnidadesByEdicion', () => {
    it('U17: Listar unidades de una edición existente', async () => {
      const mockUnidades = [{ id: 1, id_edicion: 1, titulo: 'Intro' }];
      (unidadService.getUnidadesByEdicion as jest.Mock).mockResolvedValue(mockUnidades);

      const req = createMockRequest({}, { id_edicion: '1' });
      const res = createMockResponse();

      await unidadController.getUnidadesByEdicion(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockUnidades));
      expect(unidadService.getUnidadesByEdicion).toHaveBeenCalledWith(1);
    });

    it('U18: Edición sin unidades registradas', async () => {
      (unidadService.getUnidadesByEdicion as jest.Mock).mockResolvedValue([]);

      const req = createMockRequest({}, { id_edicion: '2' });
      const res = createMockResponse();

      await unidadController.getUnidadesByEdicion(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, []));
      expect(unidadService.getUnidadesByEdicion).toHaveBeenCalledWith(2);
    });

    it('U19: Edición inexistente', async () => {
      (unidadService.getUnidadesByEdicion as jest.Mock).mockRejectedValue({ status: 404, message: 'Edición no encontrada' });

      const req = createMockRequest({}, { id_edicion: '9999' });
      const res = createMockResponse();

      await unidadController.getUnidadesByEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Edición no encontrada'));
    });
  });

  // GET UNIDAD BY ID
  describe('getUnidad', () => {
    it('U20: Consulta exitosa', async () => {
      const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Intro' };
      (unidadService.getUnidad as jest.Mock).mockResolvedValue(mockUnidad);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadController.getUnidad(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockUnidad));
      expect(unidadService.getUnidad).toHaveBeenCalledWith(1);
    });

    it('U21: Unidad inexistente', async () => {
      (unidadService.getUnidad as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });

      const req = createMockRequest({}, { id: '9999' });
      const res = createMockResponse();

      await unidadController.getUnidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad no encontrada'));
    });
  });

  // REORDER UNIDADES
  describe('reorderUnidades', () => {
    it('U22: Reordenamiento exitoso', async () => {
      const unidades = [
        { id: 1, orden: 2 },
        { id: 2, orden: 1 },
        { id: 3, orden: 3 },
      ];
      (unidadService.reorderUnidades as jest.Mock).mockResolvedValue({ message: 'Unidades reordenadas correctamente', count: 3 });

      const req = createMockRequest(unidades);
      const res = createMockResponse();

      await unidadController.reorderUnidades(req, res);

      expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidades reordenadas correctamente', count: 3 }, 'Unidades reordenadas correctamente'));
    });

    it('U23: Error por array vacío', async () => {
      const unidades: UnidadReorganize[] = [];
      (unidadService.reorderUnidades as jest.Mock).mockRejectedValue({ status: 400, message: 'Debe enviar al menos una unidad para reordenar' });

      const req = createMockRequest(unidades);
      const res = createMockResponse();

      await unidadController.reorderUnidades(req, res);

      expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Debe enviar al menos una unidad para reordenar'));
    });

    it('U24: Error por unidad sin id o sin orden', async () => {
      const unidades = [
        { id: 1 } as unknown as UnidadReorganize,  // falta orden
        { orden: 2 } as unknown as UnidadReorganize // falta id
      ];
      (unidadService.reorderUnidades as jest.Mock).mockRejectedValue({ status: 400, message: 'Cada unidad debe tener id y orden válidos' });

      const req = createMockRequest(unidades);
      const res = createMockResponse();

      await unidadController.reorderUnidades(req, res);

      expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Cada unidad debe tener id y orden válidos'));
    });

    it('U25: Error por unidad inexistente en BD', async () => {
      const unidades = [
        { id: 9999, orden: 1 },
        { id: 2, orden: 2 },
      ];
      (unidadService.reorderUnidades as jest.Mock).mockRejectedValue({ status: 404, message: 'Una o más unidades no existen' });

      const req = createMockRequest(unidades);
      const res = createMockResponse();

      await unidadController.reorderUnidades(req, res);

      expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Una o más unidades no existen'));
    });
  });
});
