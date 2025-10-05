import { Request, Response } from 'express';
import * as userController from '../../controllers/usuarios.controller';
import * as userService from '../../services/usuarios.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';

jest.mock('../../services/usuarios.service');

describe('Usuarios Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsuarios', () => {
    it('debe retornar lista de usuarios con status 200', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'Juan', email: 'juan@test.com' }
      ];

      (userService.getUsuarios as jest.Mock).mockResolvedValue(mockUsuarios);

      const req = createMockRequest();
      const res = createMockResponse();

      await userController.getUsuarios(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockUsuarios)
      );
      expect(userService.getUsuarios).toHaveBeenCalled();
    });

    it('debe retornar error 500 cuando falla el servicio', async () => {
      (userService.getUsuarios as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const req = createMockRequest();
      const res = createMockResponse();

      await userController.getUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al obtener usuarios')
      );
    });
  });

  describe('getUsuarioById', () => {
    it('debe retornar un usuario por id', async () => {
      const mockUsuario = { id: 1, nombre: 'Juan', email: 'juan@test.com' };

      (userService.getUsuario as jest.Mock).mockResolvedValue(mockUsuario);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await userController.getUsuarioById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockUsuario)
      );
      expect(userService.getUsuario).toHaveBeenCalledWith(1);
    });

    it('debe retornar 404 si el usuario no existe', async () => {
      (userService.getUsuario as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({}, { id: '999' });
      const res = createMockResponse();

      await userController.getUsuarioById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no encontrado')
      );
    });
  });

  describe('createUsuario', () => {
    it('debe crear un usuario con status 201', async () => {
      const newUser = { nombre: 'Pedro', email: 'pedro@test.com' };
      const createdUser = { id: 1, ...newUser };

      (userService.createUsuario as jest.Mock).mockResolvedValue(createdUser);

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, createdUser)
      );
    });
  });

  describe('updateUsuario', () => {
    it('debe actualizar un usuario', async () => {
      const updateData = { nombre: 'Juan Actualizado' };
      const updatedUser = { id: 1, ...updateData, email: 'juan@test.com' };

      (userService.updateUsuario as jest.Mock).mockResolvedValue(updatedUser);

      const req = createMockRequest(updateData, { id: '1' });
      const res = createMockResponse();

      await userController.updateUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, updatedUser)
      );
    });
  });

  describe('deleteUsuario', () => {
    it('debe eliminar un usuario', async () => {
      (userService.deleteUsuario as jest.Mock).mockResolvedValue(undefined);

      const req = createMockRequest({}, { id: '1' });
      const res = createMockResponse();

      await userController.deleteUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, { message: 'Usuario eliminado correctamente' })
      );
    });
  });
});