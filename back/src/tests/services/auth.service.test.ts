import { Request, Response } from 'express';
import * as authController from '../../controllers/auth.controller';
import * as authService from '../../services/auth.service';
import { ApiResponse } from '../../utils/apiResponse';

// Mock del servicio de autenticación
jest.mock('../../services/auth.service');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      body: {},
      user: undefined
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock
    };
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

      mockRequest.body = loginData;
      (authService.loginUser as jest.Mock).mockResolvedValue(mockResult);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'Password123');
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, mockResult, 'Inicio de sesión exitoso')
      );
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('debe fallar con contraseña incorrecta (LO2)', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Credenciales inválidas')
      );
    });

    it('debe fallar con usuario inexistente (LO3)', async () => {
      mockRequest.body = {
        email: 'noexiste@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Usuario no encontrado')
      );
    });

    it('debe fallar cuando falta email (LO4)', async () => {
      mockRequest.body = {
        password: 'Password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar con contraseña vacía (LO5)', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: ''
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar cuando solo falta email (LO6 - solo email)', async () => {
      mockRequest.body = {
        password: 'Password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe fallar cuando solo falta password (LO6 - solo password)', async () => {
      mockRequest.body = {
        email: 'test@example.com'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Email y password son requeridos')
      );
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al iniciar sesión')
      );
    });

    it('debe fallar con cuenta inactiva', async () => {
      mockRequest.body = {
        email: 'inactive@example.com',
        password: 'Password123'
      };

      (authService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Account inactive')
      );

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador')
      );
    });
  });

});