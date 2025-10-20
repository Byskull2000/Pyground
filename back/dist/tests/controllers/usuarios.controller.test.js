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
const userController = __importStar(require("../../controllers/usuarios.controller"));
const userService = __importStar(require("../../services/usuarios.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
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
            userService.getUsuarios.mockResolvedValue(mockUsuarios);
            const req = (0, setup_1.createMockRequest)();
            const res = (0, setup_1.createMockResponse)();
            await userController.getUsuarios(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUsuarios));
            expect(userService.getUsuarios).toHaveBeenCalled();
        });
        it('debe retornar error 500 cuando falla el servicio', async () => {
            userService.getUsuarios.mockRejectedValue(new Error('Service error'));
            const req = (0, setup_1.createMockRequest)();
            const res = (0, setup_1.createMockResponse)();
            await userController.getUsuarios(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener usuarios'));
        });
    });
    describe('getUsuarioById', () => {
        it('debe retornar un usuario por id', async () => {
            const mockUsuario = { id: 1, nombre: 'Juan', email: 'juan@test.com' };
            userService.getUsuario.mockResolvedValue(mockUsuario);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await userController.getUsuarioById(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUsuario));
            expect(userService.getUsuario).toHaveBeenCalledWith(1);
        });
        it('debe retornar 404 si el usuario no existe', async () => {
            userService.getUsuario.mockResolvedValue(null);
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await userController.getUsuarioById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
    });
    describe('createUsuario', () => {
        it('debe crear un usuario con status 201 (RE1)', async () => {
            const newUser = { nombre: 'Pedro', apellido: 'Test', email: 'pedro@test.com', password: 'Password123' };
            const createdUser = { id: 1, ...newUser };
            userService.createUsuario.mockResolvedValue(createdUser);
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, createdUser));
        });
        it('debe retornar 409 si el email ya existe (RE2)', async () => {
            const newUser = { email: 'exist@test.com', password: 'Password123', nombre: 'Juan', apellido: 'Ricaldez' };
            userService.createUsuario.mockRejectedValue({ status: 409, message: 'El email ya está registrado' });
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El email ya está registrado'));
        });
        it('debe retornar 400 si falta email (RE7)', async () => {
            const newUser = { password: 'Password123' };
            userService.createUsuario.mockRejectedValue({ status: 400, message: 'El email es obligatorio' });
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El email es obligatorio'));
        });
        it('debe retornar 400 si el email es inválido (RE4)', async () => {
            const newUser = { email: 'usuario', password: 'Password123', nombre: 'Nombre', apellido: 'Apellido' };
            userService.createUsuario.mockRejectedValue({ status: 400, message: 'Email inválido' });
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Email inválido'));
        });
        it('debe retornar 400 si la contraseña es demasiado corta (RE3/RE5)', async () => {
            const newUser = { email: 'user@test.com', password: '12', nombre: 'Nombre', apellido: 'Apellido' };
            userService.createUsuario.mockRejectedValue({ status: 400, message: 'La contraseña es demasiado corta' });
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La contraseña es demasiado corta'));
        });
        it('debe retornar 400 si la contraseña es débil (RE6)', async () => {
            const newUser = { email: 'user@test.com', password: 'abcdefg', nombre: 'Nombre', apellido: 'Apellido' };
            userService.createUsuario.mockRejectedValue({ status: 400, message: 'La contraseña no cumple requisitos de seguridad' });
            const req = (0, setup_1.createMockRequest)(newUser);
            const res = (0, setup_1.createMockResponse)();
            await userController.createUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La contraseña no cumple requisitos de seguridad'));
        });
    });
    describe('updateUsuario', () => {
        it('debe actualizar un usuario', async () => {
            const updateData = { nombre: 'Juan Actualizado' };
            const updatedUser = { id: 1, ...updateData, email: 'juan@test.com' };
            userService.updateUsuario.mockResolvedValue(updatedUser);
            const req = (0, setup_1.createMockRequest)(updateData, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await userController.updateUsuario(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updatedUser));
        });
    });
    describe('deleteUsuario', () => {
        it('debe eliminar un usuario', async () => {
            userService.deleteUsuario.mockResolvedValue(undefined);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await userController.deleteUsuario(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Usuario eliminado correctamente' }));
        });
    });
    describe('assignRolUsuario', () => {
        const userId = '1';
        it('ROL1: asignación exitosa de rol existente', async () => {
            const mockResult = { message: 'Rol asignado correctamente', user: { id: 1, rol: 'ACADEMICO' } };
            userService.assignRol.mockResolvedValue(mockResult);
            const req = (0, setup_1.createMockRequest)({ rol: 'ACADEMICO' }, { id: userId });
            const res = (0, setup_1.createMockResponse)();
            await userController.assignRolUsuario(req, res);
            expect(userService.assignRol).toHaveBeenCalledWith(1, 'ACADEMICO');
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockResult, null));
        });
        it('ROL2: intentar asignar rol inexistente', async () => {
            userService.assignRol.mockRejectedValue({ status: 400, message: 'Rol no válido' });
            const req = (0, setup_1.createMockRequest)({ rol: 'SUPERADMIN' }, { id: userId });
            const res = (0, setup_1.createMockResponse)();
            await userController.assignRolUsuario(req, res);
            expect(userService.assignRol).toHaveBeenCalledWith(1, 'SUPERADMIN');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Rol no válido'));
        });
        it('ROL5: usuario no encontrado', async () => {
            userService.assignRol.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
            const req = (0, setup_1.createMockRequest)({ rol: 'ACADEMICO' }, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await userController.assignRolUsuario(req, res);
            expect(userService.assignRol).toHaveBeenCalledWith(999, 'ACADEMICO');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
        it('ROL6: error interno del servidor', async () => {
            userService.assignRol.mockRejectedValue({ status: 500, message: 'Error al asignar rol' });
            const req = (0, setup_1.createMockRequest)({ rol: 'USUARIO' }, { id: userId });
            const res = (0, setup_1.createMockResponse)();
            await userController.assignRolUsuario(req, res);
            expect(userService.assignRol).toHaveBeenCalledWith(1, 'USUARIO');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al asignar rol'));
        });
    });
});
