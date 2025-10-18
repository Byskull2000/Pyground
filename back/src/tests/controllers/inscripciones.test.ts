import * as inscripcionController from '../../controllers/inscripciones.controller';
import * as inscripcionService from '../../services/inscripciones.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';
import { InscripcionCreate } from '../../types/inscripciones.types';

jest.mock('../../services/inscripciones.service');

describe('Inscripciones Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET INSCRIPCIONES POR EDICIÓN
  describe('getInscripcionesByEdicion', () => {
    it('IS1: Debe retornar lista de inscripciones por edición', async () => {
      const mockInscripciones = [
        { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 },
        { id: 2, usuario_id: 2, edicion_id: 1, cargo_id: 2 }
      ];

      (inscripcionService.getInscripcionesByEdicion as jest.Mock).mockResolvedValue(mockInscripciones);

      const req = createMockRequest({}, { id_edicion: '1' });
      const res = createMockResponse();

      await inscripcionController.getInscripcionesByEdicion(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockInscripciones));
      expect(inscripcionService.getInscripcionesByEdicion).toHaveBeenCalledWith(1);
    });

    it('IS2: Debe retornar lista vacía si no hay inscripciones', async () => {
      (inscripcionService.getInscripcionesByEdicion as jest.Mock).mockResolvedValue([]);

      const req = createMockRequest({}, { id_edicion: '2' });
      const res = createMockResponse();

      await inscripcionController.getInscripcionesByEdicion(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, []));
      expect(inscripcionService.getInscripcionesByEdicion).toHaveBeenCalledWith(2);
    });
  });

  // GET INSCRIPCIÓN POR ID
  describe('getInscripcion', () => {
    it('IS3: Debe retornar una inscripción existente', async () => {
      const mockInscripcion = { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 };
      (inscripcionService.getInscripcion as jest.Mock).mockResolvedValue(mockInscripcion);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await inscripcionController.getInscripcion(req, res);

      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockInscripcion));
      expect(inscripcionService.getInscripcion).toHaveBeenCalledWith(1);
    });

    it('IS4: Debe manejar error si la inscripción no existe', async () => {
      (inscripcionService.getInscripcion as jest.Mock).mockRejectedValue({ status: 404, message: 'Inscripción no encontrada' });

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await inscripcionController.getInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Inscripción no encontrada'));
    });
  });

  // CREAR INSCRIPCIÓN
  describe('createInscripcion', () => {
    const baseData: InscripcionCreate = {
      usuario_id: 1,
      edicion_id: 1,
      cargo_id: 1
    };

    it('IS5: Creación exitosa de una inscripción', async () => {
      const mockNueva = { id: 10, ...baseData };
      (inscripcionService.createInscripcion as jest.Mock).mockResolvedValue(mockNueva);

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockNueva));
      expect(inscripcionService.createInscripcion).toHaveBeenCalledWith(baseData);
    });

    it('IS6: Faltan campos obligatorios', async () => {
      const invalidData = { edicion_id: 1, cargo_id: 1 } as InscripcionCreate;
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 400, message: 'El usuario es obligatorio' });

      const req = createMockRequest(invalidData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El usuario es obligatorio'));
    });

    it('IS7: Usuario no encontrado', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 404, message: 'Usuario no encontrado o inactivo' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Usuario no encontrado o inactivo'));
    });

    it('IS8: Edición no encontrada o inactiva', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 404, message: 'Edición no encontrada o inactiva' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Edición no encontrada o inactiva'));
    });

    it('IS9: Edición no publicada', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 409, message: 'La edición no esta abierta a inscripciones' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La edición no esta abierta a inscripciones'));
    });

    it('IS10: Cargo no encontrado', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 404, message: 'Cargo no encontrado' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Cargo no encontrado'));
    });

    it('IS11: Usuario ya inscrito en la edición', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 409, message: 'El usuario ya está inscrito en esta edición' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El usuario ya está inscrito en esta edición'));
    });

    it('IS12: Error interno al crear inscripción', async () => {
      (inscripcionService.createInscripcion as jest.Mock).mockRejectedValue({ status: 500, message: 'Error al registrar la inscripción' });

      const req = createMockRequest(baseData);
      const res = createMockResponse();

      await inscripcionController.createInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Error al registrar la inscripción'));
    });
  });
});
