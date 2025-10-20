import request from 'supertest';
import express from 'express';
import * as usuariosService from '../../services/usuarios.service';
import usuariosRoutes from '../../routes/usuarios.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';
import { createAdminUserAndToken, createUserAndToken } from '../helpers/auth.helper';

// Crear app de prueba
const app = express();
app.use(express.json());
app.use('/api/usuarios', usuariosRoutes);

describe('Usuarios API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.inscripcion.deleteMany({});
        await prisma.usuario.deleteMany({});
    });

    describe('POST /api/usuarios', () => {
        it('debe crear un nuevo usuario (RE1)', async () => {
            const newUser = {
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                password: 'Password123'
            };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(201);

            const body: ApiResponse<any> = response.body;

            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.email).toBe(newUser.email);
            expect(body.data.nombre).toBe(newUser.nombre);
            expect(body.data).not.toHaveProperty('password');
            expect(body.data).not.toHaveProperty('password_hash');
            expect(body.error).toBeNull();
        });

        it('debe retornar 409 si el email ya existe (RE2)', async () => {
            await prisma.usuario.create({
                data: { email: 'exist@test.com', nombre: 'Exist', apellido: 'User', password_hash: 'hash' }
            });

            const newUser = { email: 'exist@test.com', password: 'Password123', nombre: 'Juan', apellido: 'Ricaldez' };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(409);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('El email ya está registrado');
        });

        it('debe retornar 400 si falta email (RE7)', async () => {
            const newUser = { password: 'Password123' };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('El email es obligatorio');
        });

        it('debe retornar 400 si el email es inválido (RE4)', async () => {
            const newUser = { email: 'usuario', password: 'Password123', nombre: 'Nombre', apellido: 'Apellido' };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Email inválido');
        });

        it('debe retornar 400 si la contraseña es demasiado corta (RE3/RE5)', async () => {
            const newUser = { email: 'user@test.com', password: '12', nombre: 'Nombre', apellido: 'Apellido' };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('La contraseña es demasiado corta');
        });

        it('debe retornar 400 si la contraseña es débil (RE6)', async () => {
            const newUser = { email: 'user@test.com', password: 'abcdefg', nombre: 'Nombre', apellido: 'Apellido' };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
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
            const { admin, token } = await createAdminUserAndToken();

            const response = await request(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).not.toBeNull();
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data?.length).toBe(1); // Solo el admin
            expect(body.data?.[0].id).toBe(admin.id);
            expect(body.error).toBeNull();
        });

        it('debe retornar lista de usuarios', async () => {
            const { admin, token } = await createAdminUserAndToken();

            // Crear algunos usuarios de prueba
            await prisma.usuario.createMany({
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

            const response = await request(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data?.length).toBeGreaterThanOrEqual(3); // admin + 2 test users
            expect(body.error).toBeNull();
        });
    });

    describe('GET /api/usuarios/:id', () => {
        it('debe retornar un usuario por id', async () => {
            // Crear un usuario admin para las pruebas
            const { admin: adminUser, token: adminToken } = await createAdminUserAndToken();

            // Crear un usuario normal para obtener
            const testUser = await prisma.usuario.create({
                data: {
                    email: 'test@example.com',
                    nombre: 'Test',
                    apellido: 'User',
                    password_hash: 'hash123',
                    rol: 'USUARIO'
                }
            });

            const response = await request(app)
                .get(`/api/usuarios/${testUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data?.id).toBe(testUser.id);
            expect(body.data?.email).toBe(testUser.email);
            expect(body.data).not.toHaveProperty('password');
            expect(body.error).toBeNull();
        });

        it('debe retornar 404 si el usuario no existe', async () => {
            // Crear un usuario admin para las pruebas
            const { admin: adminUser, token: adminToken } = await createAdminUserAndToken();

            const response = await request(app)
                .get('/api/usuarios/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(404);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Usuario no encontrado');
        });
    });

    describe('PUT /api/usuarios/:id', () => {
        it('debe actualizar un usuario', async () => {
            // Crear un usuario para actualizar
            const { admin: adminUser, token: adminToken } = await createAdminUserAndToken();

            const updateData = {
                nombre: 'Updated',
                bio: 'Nueva biografía'
            };

            const response = await request(app)
                .put(`/api/usuarios/${adminUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data?.nombre).toBe('Updated');
            expect(body.data?.bio).toBe('Nueva biografía');
            expect(body.error).toBeNull();

            // Verificar en la base de datos
            const updatedUser = await prisma.usuario.findUnique({
                where: { id: adminUser.id }
            });
            expect(updatedUser?.nombre).toBe('Updated');
            expect(updatedUser?.bio).toBe('Nueva biografía');
        });
    });

    describe('DELETE /api/usuarios/:id', () => {
        it('debe eliminar un usuario', async () => {
            // Crear un admin para eliminar usuarios
            const { token: adminToken } = await createAdminUserAndToken();

            // Crear un usuario para eliminar
            const { user } = await createUserAndToken();

            const response = await request(app)
                .delete(`/api/usuarios/${user.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Usuario eliminado correctamente');
            expect(body.error).toBeNull();

            const deleted = await prisma.usuario.findUnique({
                where: { id: user.id }
            });
            expect(deleted).toBeNull();
        });
    });

    describe('PUT /api/usuarios/:id/rol', () => {
        it('ROL1: asignación exitosa de rol existente', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await createAdminUserAndToken();

            // Crear un usuario para asignar rol
            const { user } = await createUserAndToken();

            const response = await request(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'ACADEMICO' })
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Rol asignado correctamente');
            expect(body.data.user).toHaveProperty('rol', 'ACADEMICO');
            expect(body.error).toBeNull();
        });

        it('ROL2: intentar asignar rol inexistente', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await createAdminUserAndToken();

            // Crear un usuario para asignar rol
            const { user } = await createUserAndToken();

            const response = await request(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'SUPERADMIN' })
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Rol no válido');
        });

        it('ROL5: usuario no encontrado', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await createAdminUserAndToken();

            const response = await request(app)
                .put('/api/usuarios/99999/rol')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'USUARIO' })
                .expect('Content-Type', /json/)
                .expect(404);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Usuario no encontrado');
        });

        it('ROL6: error interno del servidor', async () => {
            // Crear un admin para asignar roles
            const { token: adminToken } = await createAdminUserAndToken();

            // Crear un usuario para asignar rol
            const { user } = await createUserAndToken();

            jest.spyOn(usuariosService, 'assignRol').mockImplementation(() => {
                throw new Error('Simulated internal server error');
            });

            const response = await request(app)
                .put(`/api/usuarios/${user.id}/rol`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rol: 'ADMIN' })
                .expect('Content-Type', /json/)
                .expect(500);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBeDefined();
        });
    });

});
