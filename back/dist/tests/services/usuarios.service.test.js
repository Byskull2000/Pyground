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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService = __importStar(require("../../services/usuarios.service"));
const userRepo = __importStar(require("../../repositories/usuarios.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Mock del repositorio
jest.mock('../../repositories/usuarios.repository');
jest.mock('bcrypt');
describe('Usuarios Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getUsuarios', () => {
        it('debe retornar todos los usuarios', async () => {
            const mockUsuarios = [
                { id: 1, nombre: 'Juan', email: 'juan@test.com' },
                { id: 2, nombre: 'María', email: 'maria@test.com' }
            ];
            userRepo.getAllUsuarios.mockResolvedValue(mockUsuarios);
            const result = await userService.getUsuarios();
            expect(result).toEqual(mockUsuarios);
            expect(userRepo.getAllUsuarios).toHaveBeenCalledTimes(1);
        });
        it('debe manejar errores del repositorio', async () => {
            userRepo.getAllUsuarios.mockRejectedValue(new Error('Database error'));
            await expect(userService.getUsuarios()).rejects.toThrow('Database error');
        });
    });
    describe('createUsuario', () => {
        it('debe crear un usuario exitosamente (RE1)', async () => {
            const newUser = {
                nombre: 'Pedro',
                apellido: 'Test',
                email: 'pedro@test.com',
                password: 'Password123'
            };
            const hashedPassword = 'hashedpassword';
            bcrypt_1.default.hash.mockResolvedValue(hashedPassword);
            const createdUser = {
                id: 1,
                ...newUser,
                password_hash: hashedPassword,
                mensaje: "Usuario registrado. Por favor verifica tu email con el código enviado."
            };
            userRepo.createUsuario.mockResolvedValue(createdUser);
            const result = await userService.createUsuario(newUser);
            expect(result).toEqual(createdUser);
            expect(userRepo.createUsuario).toHaveBeenCalledWith(expect.objectContaining({
                email: 'pedro@test.com',
                password_hash: hashedPassword
            }));
        });
        it('debe fallar si el email ya existe (RE2)', async () => {
            const newUser = {
                email: 'exist@test.com',
                password: 'Password123',
                nombre: 'Juan',
                apellido: 'Ricaldez'
            };
            userRepo.getUsuarioByEmail.mockResolvedValue({ id: 1, email: 'exist@test.com' });
            await expect(userService.createUsuario(newUser))
                .rejects.toMatchObject({ status: 409, message: 'El email ya está registrado' });
        });
        it('debe fallar si falta email (RE7)', async () => {
            const newUser = { password: 'Password123' };
            await expect(userService.createUsuario(newUser))
                .rejects.toMatchObject({ status: 400, message: 'El email es obligatorio' });
        });
        it('debe fallar si el email es inválido (RE4)', async () => {
            const newUser = {
                email: 'usuario',
                password: 'Password123',
                nombre: 'Nombre',
                apellido: 'Apellido'
            };
            userRepo.getUsuarioByEmail.mockResolvedValue(null);
            await expect(userService.createUsuario(newUser))
                .rejects.toMatchObject({ status: 400, message: 'Email inválido' });
        });
        it('debe fallar si la contraseña es demasiado corta (RE3/RE5)', async () => {
            const newUser = {
                email: 'user@test.com',
                password: '12',
                nombre: 'Nombre',
                apellido: 'Apellido'
            };
            userRepo.getUsuarioByEmail.mockResolvedValue(null);
            await expect(userService.createUsuario(newUser))
                .rejects.toMatchObject({ status: 400, message: 'La contraseña es demasiado corta' });
        });
        it('debe fallar si la contraseña es débil (sin mayúscula/número) (RE6)', async () => {
            const newUser = {
                email: 'user@test.com',
                password: 'abcdefg',
                nombre: 'Nombre',
                apellido: 'Apellido'
            };
            userRepo.getUsuarioByEmail.mockResolvedValue(null);
            await expect(userService.createUsuario(newUser))
                .rejects.toMatchObject({ status: 400, message: 'La contraseña no cumple requisitos de seguridad' });
        });
    });
    describe('updateUsuario', () => {
        it('debe actualizar un usuario existente', async () => {
            const updateData = { nombre: 'Juan Actualizado' };
            const updatedUser = { id: 1, nombre: 'Juan Actualizado', email: 'juan@test.com' };
            userRepo.updateUsuario.mockResolvedValue(updatedUser);
            const result = await userService.updateUsuario(1, updateData);
            expect(result).toEqual(updatedUser);
            expect(userRepo.updateUsuario).toHaveBeenCalledWith(1, updateData);
        });
    });
    describe('deleteUsuario', () => {
        it('debe eliminar un usuario', async () => {
            userRepo.deleteUsuario.mockResolvedValue({ id: 1 });
            await userService.deleteUsuario(1);
            expect(userRepo.deleteUsuario).toHaveBeenCalledWith(1);
        });
    });
    describe('assignRole', () => {
        const userId = 1;
        const validUser = { id: userId, nombre: 'user', roles: ['USUARIO'] };
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('asignación exitosa de rol existente (ROL1)', async () => {
            userRepo.getUsuarioById.mockResolvedValue(validUser);
            userRepo.updateRol.mockResolvedValue({ ...validUser, roles: ['USUARIO', 'ACADEMICO'] });
            const result = await userService.assignRol(userId, 'ACADEMICO');
            expect(result).toEqual({
                message: 'Rol asignado correctamente',
                user: { ...validUser, roles: ['USUARIO', 'ACADEMICO'] }
            });
            expect(userRepo.updateRol).toHaveBeenCalledWith(userId, 'ACADEMICO');
        });
        it('ROL2: intentar asignar rol inexistente', async () => {
            await expect(userService.assignRol(userId, 'SUPERADMIN'))
                .rejects.toMatchObject({ status: 400, message: 'Rol no válido' });
        });
        it('ROL5: usuario no encontrado', async () => {
            userRepo.getUsuarioById.mockResolvedValue(null);
            await expect(userService.assignRol(999, 'ACADEMICO'))
                .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
        });
        it('ROL6: error interno del servidor', async () => {
            userRepo.getUsuarioById.mockResolvedValue(validUser);
            userRepo.updateRol.mockRejectedValue(new Error('DB error'));
            await expect(userService.assignRol(userId, 'ACADEMICO'))
                .rejects.toMatchObject({ status: 500, message: 'Error al asignar rol' });
        });
    });
});
