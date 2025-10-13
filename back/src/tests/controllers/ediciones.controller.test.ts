import { Request, Response } from 'express';
import * as edicionController from '../../controllers/ediciones.controller';
import * as edicionService from '../../services/ediciones.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';

jest.mock('../../services/ediciones.service');

describe('Ediciones Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEdicion', () => {
    it('ED1: Creación exitosa de una edición', async () => {
      const newEdicion = {
        id_curso: 1,
        nombre_edicion: 'Edición 2025',
        descripcion: 'Descripción opcional',
        fecha_apertura: '2025-10-15T00:00:00.000Z',
        fecha_cierre: null,
        creado_por: 'admin@correo.com'
      };

      const createdEdicion = { id: 1, ...newEdicion };

      (edicionService.createEdicion as jest.Mock).mockResolvedValue(createdEdicion);

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, createdEdicion));
    });

    it('ED2: Faltan campos obligatorios', async () => {
      const newEdicion = { id_curso: 1 } as any; // falta nombre_edicion y fechas
      (edicionService.createEdicion as jest.Mock).mockRejectedValue({ status: 400, message: 'Faltan campos obligatorios' });

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Faltan campos obligatorios'));
    });

    it('ED3: Curso inexistente', async () => {
      const newEdicion = {
        id_curso: 9999,
        nombre_edicion: 'Edición 2025',
        fecha_apertura: '2025-10-15T00:00:00.000Z'
      };
      (edicionService.createEdicion as jest.Mock).mockRejectedValue({ status: 404, message: 'Curso no encontrado' });

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Curso no encontrado'));
    });

    it('ED4: Fecha de apertura inválida', async () => {
      const newEdicion = {
        id_curso: 1,
        nombre_edicion: 'Edición 2025',
        fecha_apertura: 'fecha-invalida'
      };
      (edicionService.createEdicion as jest.Mock).mockRejectedValue({ status: 400, message: 'La fecha de apertura es inválida' });

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La fecha de apertura es inválida'));
    });

    it('ED5: Duplicado de edición dentro del mismo curso', async () => {
      const newEdicion = {
        id_curso: 1,
        nombre_edicion: 'Edición 2025',
        fecha_apertura: '2025-10-15T00:00:00.000Z'
      };
      (edicionService.createEdicion as jest.Mock).mockRejectedValue({ status: 409, message: 'Ya existe una edición con ese nombre para este curso' });

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Ya existe una edición con ese nombre para este curso'));
    });

    it('ED6: Fecha de cierre antes de la apertura', async () => {
      const newEdicion = {
        id_curso: 1,
        nombre_edicion: 'Edición 2025',
        fecha_apertura: '2025-10-15T00:00:00.000Z',
        fecha_cierre: '2025-10-10T00:00:00.000Z'
      };
      (edicionService.createEdicion as jest.Mock).mockRejectedValue({ status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' });

      const req = createMockRequest(newEdicion);
      const res = createMockResponse();

      await edicionController.createEdicion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La fecha de apertura no puede ser mayor a la fecha de cierre'));
    });
  });
});
