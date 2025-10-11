import request from 'supertest';
import express from 'express';
import * as usuariosService from '../../services/usuarios.service';
import usuariosRoutes from '../../routes/usuarios.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';

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
        it('debe retornar lista vacía si no hay usuarios', async () => {
            const response = await request(app)
                .get('/api/usuarios')
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
            expect(body.error).toBeNull();
        });

        it('debe retornar lista de usuarios', async () => {
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
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            //expect(body.data).toHaveLength(2);
            //expect(body.data[0]).not.toHaveProperty('password');
            expect(body.error).toBeNull();
        });
    });

    describe('GET /api/usuarios/:id', () => {
        it('debe retornar un usuario por id', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'find@test.com',
                    nombre: 'Find',
                    apellido: 'Me',
                    password_hash: 'hash'
                }
            });

            const response = await request(app)
                .get(`/api/usuarios/${created.id}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data.id).toBe(created.id);
            expect(body.data.email).toBe('find@test.com');
            expect(body.data).not.toHaveProperty('password');
            expect(body.error).toBeNull();
        });

        it('debe retornar 404 si el usuario no existe', async () => {
            const response = await request(app)
                .get('/api/usuarios/99999')
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
            const created = await prisma.usuario.create({
                data: {
                    email: 'update@test.com',
                    nombre: 'Original',
                    apellido: 'Name',
                    password_hash: 'hash'
                }
            });

            const updateData = {
                nombre: 'Updated',
                bio: 'Nueva biografía'
            };

            const response = await request(app)
                .put(`/api/usuarios/${created.id}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data.nombre).toBe('Updated');
            expect(body.data.bio).toBe('Nueva biografía');
            expect(body.error).toBeNull();
        });
    });

    describe('DELETE /api/usuarios/:id', () => {
        it('debe eliminar un usuario', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'delete@test.com',
                    nombre: 'Delete',
                    apellido: 'Me',
                    password_hash: 'hash'
                }
            });

            const response = await request(app)
                .delete(`/api/usuarios/${created.id}`)
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Usuario eliminado correctamente');
            expect(body.error).toBeNull();

            const deleted = await prisma.usuario.findUnique({
                where: { id: created.id }
            });
            expect(deleted).toBeNull();
        });
    });

    describe('PUT /api/usuarios/:id/rol', () => {
        it('ROL1: asignación exitosa de rol existente', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'rol1@test.com',
                    nombre: 'Rol',
                    apellido: 'Uno',
                    password_hash: 'hash'
                }
            });

            const response = await request(app)
                .put(`/api/usuarios/${created.id}/rol`)
                .send({ rol: 'ACADEMICO' })
                //.set('Authorization', `Bearer ${token}`) // token omitido por ahora
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Rol asignado correctamente');
            expect(body.data.user).toHaveProperty('rol', 'ACADEMICO');
            expect(body.error).toBeNull();
        });

        it('ROL2: intentar asignar rol inexistente', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'rol2@test.com',
                    nombre: 'Rol',
                    apellido: 'Dos',
                    password_hash: 'hash'
                }
            });

            const response = await request(app)
                .put(`/api/usuarios/${created.id}/rol`)
                .send({ rol: 'SUPERADMIN' })
                //.set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(400);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Rol no válido');
        });

        it('ROL5: usuario no encontrado', async () => {
            const response = await request(app)
                .put('/api/usuarios/99999/rol')
                .send({ rol: 'USUARIO' })
                //.set('Authorization', `Bearer ${token}`) 
                .expect('Content-Type', /json/)
                .expect(404);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Usuario no encontrado');
        });

        it('ROL6: error interno del servidor', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'error500@test.com',
                    nombre: 'Error',
                    apellido: 'Server',
                    password_hash: 'hash'
                }
            });

            jest.spyOn(usuariosService, 'assignRol').mockImplementation(() => {
                throw new Error('Simulated internal server error');
            });


            const response = await request(app)
                .put(`/api/usuarios/${created.id}/rol`)
                .send({ rol: 'ADMIN' }) 
                //.set('Authorization', `Bearer ${token}`) 
                .expect('Content-Type', /json/)
                .expect(500);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBeDefined();
        });
    });

});
