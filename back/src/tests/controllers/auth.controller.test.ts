import { Request, Response } from 'express';
import * as authController from '../../controllers/auth.controller';
import * as authService from '../../services/auth.service';
import { createMockRequest, createMockResponse } from '../setup';
import { ApiResponse } from '../../utils/apiResponse';

jest.mock('../../services/auth.service');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe hacer login exitoso con credenciales válidas y retornar JWT (LO1)', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };
      
      const mockResult = {
        token: 'jwt-token-123',
        usuario: { id: 1, email: 'test@example.com', nombre: 'Test' }
      };

      (authService.loginUser as jest.Mock).mockResolvedValue(mockResult);

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, mockResult, 'Inicio de sesión exitoso')
      );
      expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'Password123');
    });

    it('debe fallar con contraseña incorrecta (LO2)', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Credenciales inválidas')
      );
    });

    it('debe fallar con usuario inexistente (LO3)', async () => {
      const loginData = {
        email: 'noexiste@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no encontrado')
      );
    });

    it('debe fallar cuando falta email (LO4)', async () => {
      const loginData = {
        password: 'Password123'
      };

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar con contraseña vacía (LO5)', async () => {
      const loginData = {
        email: 'test@example.com',
        password: ''
      };

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar cuando solo falta email (LO6 - solo email)', async () => {
      const loginData = {
        password: 'Password123'
      };

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar cuando solo falta password (LO6 - solo password)', async () => {
      const loginData = {
        email: 'test@example.com'
      };

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe manejar errores del servidor', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al iniciar sesión')
      );
    });

    it('debe fallar con cuenta inactiva', async () => {
      const loginData = {
        email: 'inactive@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Account inactive')
      );

      const req = createMockRequest(loginData);
      const res = createMockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador')
      );
    });
  });

  describe('changePassword', () => {
    it('debe cambiar la contraseña exitosamente', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      (authService.changePassword as jest.Mock).mockResolvedValue(undefined);

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(true, { message: 'Contraseña actualizada correctamente' })
      );
      expect(authService.changePassword).toHaveBeenCalledWith(1, 'OldPassword123', 'NewPassword456');
    });

    it('debe fallar si no está autenticado', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      const req = createMockRequest(passwordData);
      req.user = undefined;
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'No autorizado')
      );
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('debe fallar con contraseña actual incorrecta', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword456'
      };

      (authService.changePassword as jest.Mock).mockRejectedValue(
        new Error('Invalid current password')
      );

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Contraseña actual incorrecta')
      );
    });

    it('debe fallar con nueva contraseña muy corta', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: '123'
      };

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'La nueva contraseña debe tener al menos 6 caracteres')
      );
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('debe fallar cuando falta contraseña actual', async () => {
      const passwordData = {
        newPassword: 'NewPassword456'
      };

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Contraseña actual y nueva contraseña son requeridas')
      );
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('debe fallar cuando falta nueva contraseña', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123'
      };

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Contraseña actual y nueva contraseña son requeridas')
      );
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('debe manejar errores del servidor', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      (authService.changePassword as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const req = createMockRequest(passwordData);
      req.user = { id: 1, email: 'test@example.com', nombre: 'Test', apellido: 'User' };
      const res = createMockResponse();

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al cambiar contraseña')
      );
    });
  });
});