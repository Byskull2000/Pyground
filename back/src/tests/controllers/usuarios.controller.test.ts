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
    it('debe crear un usuario con status 201 (RE1)', async () => {
      const newUser = { nombre: 'Pedro', apellido: 'Test', email: 'pedro@test.com', password: 'Password123' };
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

    it('debe retornar 409 si el email ya existe (RE2)', async () => {
      const newUser = { email: 'exist@test.com', password: 'Password123', nombre: 'Juan', apellido: 'Ricaldez' };
      (userService.createUsuario as jest.Mock).mockRejectedValue({ status: 409, message: 'El email ya está registrado' });

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El email ya está registrado'));
    });
    
    it('debe retornar 400 si falta email (RE7)', async () => {
      const newUser = { password: 'Password123' } as any;
      (userService.createUsuario as jest.Mock).mockRejectedValue({ status: 400, message: 'El email es obligatorio' });

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'El email es obligatorio'));
    });

    it('debe retornar 400 si el email es inválido (RE4)', async () => {
      const newUser = { email: 'usuario', password: 'Password123', nombre: 'Nombre', apellido: 'Apellido' };
      (userService.createUsuario as jest.Mock).mockRejectedValue({ status: 400, message: 'Email inválido' });

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Email inválido'));
    });

    it('debe retornar 400 si la contraseña es demasiado corta (RE3/RE5)', async () => {
      const newUser = { email: 'user@test.com', password: '12', nombre: 'Nombre', apellido: 'Apellido' };
      (userService.createUsuario as jest.Mock).mockRejectedValue({ status: 400, message: 'La contraseña es demasiado corta' });

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La contraseña es demasiado corta'));
    });

    it('debe retornar 400 si la contraseña es débil (RE6)', async () => {
      const newUser = { email: 'user@test.com', password: 'abcdefg', nombre: 'Nombre', apellido: 'Apellido' };
      (userService.createUsuario as jest.Mock).mockRejectedValue({ status: 400, message: 'La contraseña no cumple requisitos de seguridad' });

      const req = createMockRequest(newUser);
      const res = createMockResponse();

      await userController.createUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'La contraseña no cumple requisitos de seguridad'));
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

  describe('assignRolUsuario', () => {
    const userId = '1';

    it('ROL1: asignación exitosa de rol existente', async () => {
      const mockResult = { message: 'Rol asignado correctamente', user: { id: 1, rol: 'ACADEMICO' } };
      (userService.assignRol as jest.Mock).mockResolvedValue(mockResult);

      const req = createMockRequest({ rol: 'ACADEMICO' }, { id: userId });
      const res = createMockResponse();

      await userController.assignRolUsuario(req, res);

      expect(userService.assignRol).toHaveBeenCalledWith(1, 'ACADEMICO');
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(true, mockResult, null));
    });

    it('ROL2: intentar asignar rol inexistente', async () => {
      (userService.assignRol as jest.Mock).mockRejectedValue({ status: 400, message: 'Rol no válido' });

      const req = createMockRequest({ rol: 'SUPERADMIN' }, { id: userId });
      const res = createMockResponse();

      await userController.assignRolUsuario(req, res);

      expect(userService.assignRol).toHaveBeenCalledWith(1, 'SUPERADMIN');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Rol no válido'));
    });

    it('ROL5: usuario no encontrado', async () => {
      (userService.assignRol as jest.Mock).mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });

      const req = createMockRequest({ rol: 'ACADEMICO' }, { id: '999' });
      const res = createMockResponse();

      await userController.assignRolUsuario(req, res);

      expect(userService.assignRol).toHaveBeenCalledWith(999, 'ACADEMICO');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Usuario no encontrado'));
    });

    it('ROL6: error interno del servidor', async () => {
      (userService.assignRol as jest.Mock).mockRejectedValue({ status: 500, message: 'Error al asignar rol' });

      const req = createMockRequest({ rol: 'USUARIO' }, { id: userId });
      const res = createMockResponse();

      await userController.assignRolUsuario(req, res);

      expect(userService.assignRol).toHaveBeenCalledWith(1, 'USUARIO');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiResponse(false, null, 'Error al asignar rol'));
    });
  });

});