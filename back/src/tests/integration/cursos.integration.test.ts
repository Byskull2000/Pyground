import request from 'supertest';
import express from 'express';
import cursosRoutes from '../../routes/cursos.routes';
import prisma from '../../config/prisma';

// Crear app de prueba
const app = express();
app.use(express.json());
app.use('/api/cursos', cursosRoutes);

describe('Cursos API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.curso.deleteMany({});
    });

    describe('GET /api/cursos', () => {
        it('debe retornar lista vacía si no hay cursos', async () => {
            const response = await request(app)
                .get('/api/cursos')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('debe retornar lista de cursos', async () => {
            await prisma.curso.createMany({
                data: [
                    {
                        nombre: 'Python',
                        codigo_curso: 'PYT001',
                        descripcion: 'Curso de Python',
                        activo: true,
                        fecha_creacion: new Date(),
                        creado_por: 'Admin'
                    },
                    {
                        nombre: 'Java',
                        codigo_curso: 'JAV002',
                        descripcion: 'Curso de Java',
                        activo: true,
                        fecha_creacion: new Date(),
                        creado_por: 'Admin'
                    }
                ]
            });

            const response = await request(app)
                .get('/api/cursos')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('nombre');
            expect(response.body[0]).toHaveProperty('codigo_curso');
        });
    });

    describe('GET /api/cursos/:id', () => {
        it('debe retornar un curso por id', async () => {
            const created = await prisma.curso.create({
                data: {
                    nombre: 'Java',
                    codigo_curso: 'JAV001',
                    descripcion: 'Curso de Java',
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: 'Admin'
                }
            });

            const response = await request(app)
                .get(`/api/cursos/${created.id}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('nombre');
            expect(response.body.nombre).toBe('Java');
        });

        it('debe retornar 404 si el curso no existe', async () => {
            const response = await request(app)
                .get('/api/cursos/99999')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });
});
