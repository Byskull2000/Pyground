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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const usuariosService = __importStar(require("../../services/usuarios.service"));
const usuarios_routes_1 = __importDefault(require("../../routes/usuarios.routes"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_helper_1 = require("../helpers/auth.helper");
// Crear app de prueba
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/usuarios', usuarios_routes_1.default);
describe('Usuarios API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.inscripcion.deleteMany({});
        await prisma_1.default.usuario.deleteMany({});
    });
    describe('POST /api/usuarios', () => {
        it('debe crear un nuevo usuario (RE1)', async () => {
            const newUser = {
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                password: 'Password123'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.email).toBe(newUser.email);
            expect(body.data.nombre).toBe(newUser.nombre);
            expect(body.data).not.toHaveProperty('password');
            expect(body.data).not.toHaveProperty('password_hash');
            expect(body.error).toBeNull();
        });
        it('debe retornar 409 si el email ya existe (RE2)', async () => {
            await prisma_1.default.usuario.create({
                data: { email: 'exist@test.com', nombre: 'Exist', apellido: 'User', password_hash: 'hash' }
            });
            const newUser = { email: 'exist@test.com', password: 'Password123', nombre: 'Juan', apellido: 'Ricaldez' };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(409);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('El email ya está registrado');
        });
        it('debe retornar 400 si falta email (RE7)', async () => {
            const newUser = { password: 'Password123' };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('El email es obligatorio');
        });
        it('debe retornar 400 si el email es inválido (RE4)', async () => {
            const newUser = { email: 'usuario', password: 'Password123', nombre: 'Nombre', apellido: 'Apellido' };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Email inválido');
        });
        it('debe retornar 400 si la contraseña es demasiado corta (RE3/RE5)', async () => {
            const newUser = { email: 'user@test.com', password: '12', nombre: 'Nombre', apellido: 'Apellido' };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('La contraseña es demasiado corta');
        });
        it('debe retornar 400 si la contraseña es débil (RE6)', async () => {
            const newUser = { email: 'user@test.com', password: 'abcdefg', nombre: 'Nombre', apellido: 'Apellido' };
            const response = await (0, supertest_1.default)(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('La contraseña no cumple requisitos de seguridad');
        });
        /*
        it('debe retornar 500 si falla la creación', async () => {
            const invalidUser = {
                // email faltante
                nombre: 'Test',
                apellido: 'User'
            };
            

            const response = await request(app)
                .post('/api/usuarios')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(500);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBeDefined();
        });
        */
    });
    describe('GET /api/usuarios', () => {
        it('debe retornar solo el admin si no hay otros usuarios', async () => {
            const { admin, token } = await (0, auth_helper_1.createAdminUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).not.toBeNull();
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data?.length).toBe(1); // Solo el admin
            expect(body.data?.[0].id).toBe(admin.id);
            expect(body.error).toBeNull();
        });
        it('debe retornar lista de usuarios', async () => {
            const { admin, token } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear algunos usuarios de prueba
            await prisma_1.default.usuario.createMany({
                data: [
                    {
                        email: 'user1@test.com',
                        nombre: 'User',
                        apellido: 'One',
                        password_hash: 'hash1'
                    },
                    {
                        email: 'user2@test.com',
                        nombre: 'User',
                        apellido: 'Two',
                        password_hash: 'hash2'
                    }
                ]
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data?.length).toBeGreaterThanOrEqual(3); // admin + 2 test users
            expect(body.error).toBeNull();
        });
    });
    describe('GET /api/usuarios/:id', () => {
        it('debe retornar un usuario por id', async () => {
            // Crear un usuario admin para las pruebas
            const { admin: adminUser, token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear un usuario normal para obtener
            const testUser = await prisma_1.default.usuario.create({
                data: {
                    email: 'test@example.com',
                    nombre: 'Test',
                    apellido: 'User',
                    password_hash: 'hash123',
                    rol: 'USUARIO'
                }
            });
            const response = await (0, supertest_1.default)(app)
                .get(`/api/usuarios/${testUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data?.id).toBe(testUser.id);
            expect(body.data?.email).toBe(testUser.email);
            expect(body.data).not.toHaveProperty('password');
            expect(body.error).toBeNull();
        });
        it('debe retornar 404 si el usuario no existe', async () => {
            // Crear un usuario admin para las pruebas
            const { admin: adminUser, token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .get('/api/usuarios/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Usuario no encontrado');
        });
    });
    describe('PUT /api/usuarios/:id', () => {
        it('debe actualizar un usuario', async () => {
            // Crear un usuario para actualizar
            const { admin: adminUser, token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const updateData = {
                nombre: 'Updated',
                bio: 'Nueva biografía'
            };
            const response = await (0, supertest_1.default)(app)
                .put(`/api/usuarios/${adminUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data?.nombre).toBe('Updated');
            expect(body.data?.bio).toBe('Nueva biografía');
            expect(body.error).toBeNull();
            // Verificar en la base de datos
            const updatedUser = await prisma_1.default.usuario.findUnique({
                where: { id: adminUser.id }
            });
            expect(updatedUser?.nombre).toBe('Updated');
            expect(updatedUser?.bio).toBe('Nueva biografía');
        });
    });
    describe('DELETE /api/usuarios/:id', () => {
        it('debe eliminar un usuario', async () => {
            // Crear un admin para eliminar usuarios
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear un usuario para eliminar
            const { user } = await (0, auth_helper_1.createUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/usuarios/${user.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Usuario eliminado correctamente');
            expect(body.error).toBeNull();
            const deleted = await prisma_1.default.usuario.findUnique({
                where: { id: user.id }
            });
            expect(deleted).toBeNull();
        });
    });
    describe('PUT /api/usuarios/:id/rol', () => {
        it('ROL1: asignación exitosa de rol existente', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear un usuario para asignar rol
            const { user } = await (0, auth_helper_1.createUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'ACADEMICO' })
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Rol asignado correctamente');
            expect(body.data.user).toHaveProperty('rol', 'ACADEMICO');
            expect(body.error).toBeNull();
        });
        it('ROL2: intentar asignar rol inexistente', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear un usuario para asignar rol
            const { user } = await (0, auth_helper_1.createUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'SUPERADMIN' })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Rol no válido');
        });
        it('ROL5: usuario no encontrado', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .put('/api/usuarios/99999/rol')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'USUARIO' })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Usuario no encontrado');
        });
        it('ROL6: error interno del servidor', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            // Crear un usuario para asignar rol
            const { user } = await (0, auth_helper_1.createUserAndToken)();
            jest.spyOn(usuariosService, 'assignRol').mockImplementation(() => {
                throw new Error('Simulated internal server error');
            });
            const response = await (0, supertest_1.default)(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'ADMIN' })
                .expect('Content-Type', /json/)
                .expect(500);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBeDefined();
        });
    });
});
