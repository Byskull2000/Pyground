import * as unidadPlantillaController from '../../controllers/unidades.plantilla.controller';
import * as unidadPlantillaService from '../../services/unidades.plantilla.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../../types/unidades.plantilla.types';

jest.mock('../../services/unidades.plantilla.service');

describe('UnidadPlantilla Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET UNIDADES
  describe('getUnidadesPlantilla', () => {
    it('UP11: Listar unidades de un curso existente', async () => {
      const mockUnidades = [
        { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true }
      ];
      (unidadPlantillaService.getUnidadesPlantilla as jest.Mock).mockResolvedValue(mockUnidades);

      const req = createMockRequest({}, { id_curso: '1' });
      const res = createMockResponse();

      await unidadPlantillaController.getUnidadesPlantilla(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockUnidades));
      expect(unidadPlantillaService.getUnidadesPlantilla).toHaveBeenCalledWith(1);
    });

    it('UP12: Curso sin unidades registradas', async () => {
      (unidadPlantillaService.getUnidadesPlantilla as jest.Mock).mockResolvedValue([]);

      const req = createMockRequest({}, { id_curso: '2' });
      const res = createMockResponse();

      await unidadPlantillaController.getUnidadesPlantilla(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, []));
      expect(unidadPlantillaService.getUnidadesPlantilla).toHaveBeenCalledWith(2);
    });

    it('UP13: Curso inexistente', async () => {
      (unidadPlantillaService.getUnidadesPlantilla as jest.Mock).mockRejectedValue({ status: 404, message: 'Curso no encontrado' });

      const req = createMockRequest({}, { id_curso: '9999' });
      const res = createMockResponse();

      await unidadPlantillaController.getUnidadesPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Curso no encontrado'));
    });
  });

  // GET UNIDAD
  describe('getUnidadPlantilla', () => {
    it('UP1: Obtener unidad existente', async () => {
      const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
      (unidadPlantillaService.getUnidadPlantilla as jest.Mock).mockResolvedValue(mockUnidad);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadPlantillaController.getUnidadPlantilla(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockUnidad));
      expect(unidadPlantillaService.getUnidadPlantilla).toHaveBeenCalledWith(1);
    });

    it('UP8/UP10: Unidad inexistente', async () => {
      (unidadPlantillaService.getUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadPlantillaController.getUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad plantilla no encontrada'));
    });
  });

  // CREATE UNIDAD
  describe('createUnidadPlantilla', () => {
    const baseData: UnidadPlantillaCreate = { id_curso: 1, titulo: 'Introducción', orden: 1 };

    it('UP1: Creación exitosa', async () => {
      const mockNueva = { id: 10, ...baseData, version: 1, activo: true };
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockResolvedValue(mockNueva);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockNueva));
      expect(unidadPlantillaService.createUnidadPlantilla).toHaveBeenCalledWith(baseData);
    });

    it('UP2: Faltan título', async () => {
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 400, message: 'El título es obligatorio' });

      const req = createMockRequest({ ...baseData, titulo: '' });
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El título es obligatorio'));
    });

    it('UP3: Faltan id_curso', async () => {
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 400, message: 'El curso es obligatorio' });

      const req = createMockRequest({ ...baseData, id_curso: null });
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El curso es obligatorio'));
    });

    it('UP4: Faltan orden', async () => {
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 400, message: 'El orden es obligatorio' });

      const req = createMockRequest({ ...baseData, orden: null });
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El orden es obligatorio'));
    });

    it('UP5: Unidad duplicada', async () => {
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 409, message: 'Ya existe una unidad con ese nombre para este curso' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Ya existe una unidad con ese nombre para este curso'));
    });

    it('UP6: Error interno del repositorio', async () => {
      (unidadPlantillaService.createUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 500, message: 'Error al crear la unidad plantilla' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await unidadPlantillaController.createUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Error al crear la unidad plantilla'));
    });
  });

  // UPDATE UNIDAD
  describe('updateUnidadPlantilla', () => {
    const updateData: UnidadPlantillaUpdate = { titulo: 'Nuevo Título' };

    it('UP7: Actualización exitosa', async () => {
      const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
      const updatedUnidad = { ...mockUnidad, ...updateData };
      (unidadPlantillaService.updateUnidadPlantilla as jest.Mock).mockResolvedValue(updatedUnidad);

      const req = createMockRequest(updateData, { id: '1' });
      const res = createMockResponse();

      await unidadPlantillaController.updateUnidadPlantilla(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, updatedUnidad));
      expect(unidadPlantillaService.updateUnidadPlantilla).toHaveBeenCalledWith(1, updateData);
    });

    it('UP8: Unidad inexistente', async () => {
      (unidadPlantillaService.updateUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });

      const req = createMockRequest(updateData, { id: '999' });
      const res = createMockResponse();

      await unidadPlantillaController.updateUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad plantilla no encontrada'));
    });
  });

  // DELETE UNIDAD
  describe('deleteUnidadPlantilla', () => {
    it('UP9: Eliminación exitosa', async () => {
      const mockResponse = { id: 1, activo: false };
      (unidadPlantillaService.deleteUnidadPlantilla as jest.Mock).mockResolvedValue(mockResponse);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await unidadPlantillaController.deleteUnidadPlantilla(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, { message: 'Unidad plantilla eliminada correctamente' }));
      expect(unidadPlantillaService.deleteUnidadPlantilla).toHaveBeenCalledWith(1);
    });

    it('UP10: Unidad inexistente', async () => {
      (unidadPlantillaService.deleteUnidadPlantilla as jest.Mock).mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await unidadPlantillaController.deleteUnidadPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Unidad plantilla no encontrada'));
    });
  });
});
