"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const authController = __importStar(require("../../controllers/auth.controller"));
const authService = __importStar(require("../../services/auth.service"));
const apiResponse_1 = require("../../utils/apiResponse");
// Mock del servicio de autenticación
jest.mock('../../services/auth.service');
describe('Auth Controller', () => {
    let mockRequest;
    let mockResponse;
    let statusMock;
    let jsonMock;
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
            authService.loginUser.mockResolvedValue(mockResult);
            await authController.login(mockRequest, mockResponse);
            expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'Password123');
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockResult, 'Inicio de sesión exitoso'));
            expect(statusMock).not.toHaveBeenCalled();
        });
        it('debe fallar con contraseña incorrecta (LO2)', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };
            authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Credenciales inválidas'));
        });
        it('debe fallar con usuario inexistente (LO3)', async () => {
            mockRequest.body = {
                email: 'noexiste@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('User not found'));
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
        it('debe fallar cuando falta email (LO4)', async () => {
            mockRequest.body = {
                password: 'Password123'
            };
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar con contraseña vacía (LO5)', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: ''
            };
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar cuando solo falta email (LO6 - solo email)', async () => {
            mockRequest.body = {
                password: 'Password123'
            };
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar cuando solo falta password (LO6 - solo password)', async () => {
            mockRequest.body = {
                email: 'test@example.com'
            };
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('Database connection error'));
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al iniciar sesión'));
        });
        it('debe fallar con cuenta inactiva', async () => {
            mockRequest.body = {
                email: 'inactive@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('Account inactive'));
            await authController.login(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador'));
        });
    });
});
