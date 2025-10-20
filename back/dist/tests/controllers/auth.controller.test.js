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
// back/src/tests/controllers/auth.controller.test.ts
const authController = __importStar(require("../../controllers/auth.controller"));
const authService = __importStar(require("../../services/auth.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
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
            authService.loginUser.mockResolvedValue(mockResult);
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockResult, 'Inicio de sesión exitoso'));
            expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'Password123');
        });
        it('debe fallar con contraseña incorrecta (LO2)', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };
            authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Credenciales inválidas'));
        });
        it('debe fallar con usuario inexistente (LO3)', async () => {
            const loginData = {
                email: 'noexiste@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('User not found'));
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
        it('debe fallar cuando falta email (LO4)', async () => {
            const loginData = {
                password: 'Password123'
            };
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar con contraseña vacía (LO5)', async () => {
            const loginData = {
                email: 'test@example.com',
                password: ''
            };
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar cuando solo falta email (LO6 - solo email)', async () => {
            const loginData = {
                password: 'Password123'
            };
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe fallar cuando solo falta password (LO6 - solo password)', async () => {
            const loginData = {
                email: 'test@example.com'
            };
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
        it('debe manejar errores del servidor', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('Database connection error'));
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al iniciar sesión'));
        });
        it('debe fallar con cuenta inactiva', async () => {
            const loginData = {
                email: 'inactive@example.com',
                password: 'Password123'
            };
            authService.loginUser.mockRejectedValue(new Error('Account inactive'));
            const req = (0, setup_1.createMockRequest)(loginData);
            const res = (0, setup_1.createMockResponse)();
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador'));
        });
    });
});
