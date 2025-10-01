import request from 'supertest';
import express from 'express';
import usuariosRoutes from '../../routes/usuarios.routes';

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
        it('debe crear un nuevo usuario', async () => {
            const newUser = {
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                password_hash: 'hashed_password'
            };

            const response = await request(app)
                .post('/api/usuarios')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(newUser.email);
            expect(response.body.nombre).toBe(newUser.nombre);
            expect(response.body).not.toHaveProperty('password_hash');
        });

        it('debe retornar 500 si falla la creación', async () => {
            const invalidUser = {
                // email faltante
                nombre: 'Test',
                apellido: 'User'
            };

            await request(app)
                .post('/api/usuarios')
                .send(invalidUser)
                .expect(500);
        });
    });

    describe('GET /api/usuarios', () => {
        it('debe retornar lista vacía si no hay usuarios', async () => {
            const response = await request(app)
                .get('/api/usuarios')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual([]);
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

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).not.toHaveProperty('password_hash');
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

            expect(response.body.id).toBe(created.id);
            expect(response.body.email).toBe('find@test.com');
        });

        it('debe retornar 404 si el usuario no existe', async () => {
            const response = await request(app)
                .get('/api/usuarios/99999')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('error');
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

            expect(response.body.nombre).toBe('Updated');
            expect(response.body.bio).toBe('Nueva biografía');
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

            expect(response.body).toHaveProperty('message');

            const deleted = await prisma.usuario.findUnique({
                where: { id: created.id }
            });
            expect(deleted).toBeNull();
        });
    });
});

// -----------------------------------------------------------
// src/tests/repositories/usuarios.repository.test.ts
import { PrismaClient } from '../../../generated/prisma';
import * as userRepo from '../../repositories/usuarios.repository';

const prisma = new PrismaClient();

describe('Usuarios Repository - Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.usuario.deleteMany({});
    });

    describe('getAllUsuarios', () => {
        it('debe retornar lista vacía si no hay usuarios', async () => {
            const result = await userRepo.getAllUsuarios();
            expect(result).toEqual([]);
        });

        it('debe retornar todos los usuarios sin password_hash', async () => {
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

            const result = await userRepo.getAllUsuarios();

            expect(result).toHaveLength(2);
            expect(result[0]).not.toHaveProperty('password_hash');
            expect(result[1]).not.toHaveProperty('password_hash');
        });
    });

    describe('getUsuarioById', () => {
        it('debe retornar un usuario por id', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'find@test.com',
                    nombre: 'Find',
                    apellido: 'Me',
                    password_hash: 'hash'
                }
            });

            const result = await userRepo.getUsuarioById(created.id);

            expect(result).not.toBeNull();
            expect(result?.id).toBe(created.id);
            expect(result?.email).toBe('find@test.com');
            expect(result).not.toHaveProperty('password_hash');
        });

        it('debe retornar null si el usuario no existe', async () => {
            const result = await userRepo.getUsuarioById(99999);
            expect(result).toBeNull();
        });
    });

    describe('createUsuario', () => {
        it('debe crear un usuario en la base de datos', async () => {
            const newUser = {
                email: 'test@example.com',
                nombre: 'Juan',
                apellido: 'Pérez',
                password_hash: 'hashed_password_123'
            };

            const result = await userRepo.createUsuario(newUser);

            expect(result).toHaveProperty('id');
            expect(result.email).toBe(newUser.email);
            expect(result.nombre).toBe(newUser.nombre);
            expect(result.apellido).toBe(newUser.apellido);
            expect(result).not.toHaveProperty('password_hash');
        });

        it('debe lanzar error si el email ya existe', async () => {
            const user = {
                email: 'duplicate@example.com',
                nombre: 'Juan',
                apellido: 'Pérez',
                password_hash: 'hash'
            };

            await userRepo.createUsuario(user);
            await expect(userRepo.createUsuario(user)).rejects.toThrow();
        });

        it('debe crear usuario con google_id', async () => {
            const googleUser = {
                email: 'google@test.com',
                nombre: 'Google',
                apellido: 'User',
                google_id: 'google123',
                provider: 'google'
            };

            const result = await userRepo.createUsuario(googleUser);

            expect(result.email).toBe(googleUser.email);
            expect(result.provider).toBe('google');
        });
    });

    describe('updateUsuario', () => {
        it('debe actualizar un usuario existente', async () => {
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

            const result = await userRepo.updateUsuario(created.id, updateData);

            expect(result.nombre).toBe('Updated');
            expect(result.bio).toBe('Nueva biografía');
            expect(result.apellido).toBe('Name');
        });

        it('debe lanzar error si el usuario no existe', async () => {
            await expect(
                userRepo.updateUsuario(99999, { nombre: 'Test' })
            ).rejects.toThrow();
        });
    });

    describe('deleteUsuario', () => {
        it('debe eliminar un usuario', async () => {
            const created = await prisma.usuario.create({
                data: {
                    email: 'delete@test.com',
                    nombre: 'Delete',
                    apellido: 'Me',
                    password_hash: 'hash'
                }
            });

            await userRepo.deleteUsuario(created.id);

            const found = await prisma.usuario.findUnique({
                where: { id: created.id }
            });

            expect(found).toBeNull();
        });

        it('debe lanzar error si el usuario no existe', async () => {
            await expect(userRepo.deleteUsuario(99999)).rejects.toThrow();
        });
    });
});