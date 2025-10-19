import request from 'supertest';
import express from 'express';
import cursosRoutes from '../../routes/cursos.routes';
import prisma from '../../config/prisma';
import { ApiResponse } from '../../utils/apiResponse';

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
        await prisma.topico.deleteMany({});
        await prisma.topicoPlantilla.deleteMany({});
        await prisma.inscripcion.deleteMany({});
        await prisma.unidad.deleteMany({});
        await prisma.unidadPlantilla.deleteMany({});
        await prisma.edicion.deleteMany({});
        await prisma.curso.deleteMany({});
    });

    describe('GET /api/cursos', () => {
        it('debe retornar lista vacía si no hay cursos', async () => {
            const response = await request(app)
                .get('/api/cursos')
                .expect('Content-Type', /json/)
                .expect(200);

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
            expect(body.error).toBeNull();
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

            const body: ApiResponse<any[]> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveLength(2);
            //expect(body.data[0]).toHaveProperty('id');
            //expect(body.data[0]).toHaveProperty('nombre');
            //expect(body.data[0]).toHaveProperty('codigo_curso');
            expect(body.error).toBeNull();
        });
    });

    describe('GET /api/cursos/:id', () => {
        it('debe retornar un curso por id (VC1)', async () => {
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

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id', created.id);
            expect(body.data).toHaveProperty('nombre', 'Java');
            expect(body.error).toBeNull();
        });

        it('debe retornar 404 si el curso no existe (VC2)', async () => {
            const response = await request(app)
                .get('/api/cursos/99999')
                .expect('Content-Type', /json/)
                .expect(404);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Curso no encontrado');
        });

        it('VC5 - Error del servidor al obtener datos', async () => {
            const originalFindUnique = prisma.curso.findUnique;
            (prisma.curso.findUnique as any) = jest.fn(() => {
                throw new Error('Error simulado en la base de datos');
            });

            const response = await request(app)
                .get('/api/cursos/1')
                //.set('Authorization', `Bearer ${tokenValido}`)
                .expect('Content-Type', /json/)
                .expect(500);

            const body: ApiResponse<any> = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch("Error al obtener curso");

            prisma.curso.findUnique = originalFindUnique;
        });
    });

    // --- GET /api/cursos/publicar/:id ---
    describe('GET /api/cursos/publicar/:id', () => {
        it('PC1 - debe publicar un curso correctamente', async () => {
        const curso = await prisma.curso.create({
            data: {
            nombre: 'C++',
            codigo_curso: 'CPP001',
            descripcion: 'Curso de C++',
            activo: true,
            fecha_creacion: new Date(),
            creado_por: 'Admin'
            }
        });

        await prisma.unidadPlantilla.create({
            data: {
            titulo: 'Unidad 1',
            descripcion: 'Intro',
            id_curso: curso.id,
            orden: 1,
            version: 1
            }
        });

        const response = await request(app)
            .get(`/api/cursos/publicar/${curso.id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('message', 'Curso publicado correctamente');
        });

        it('PC2 - debe retornar 404 si el curso no existe', async () => {
        const response = await request(app)
            .get('/api/cursos/publicar/9999')
            .expect('Content-Type', /json/)
            .expect(404);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/Curso no encontrado|no tiene unidades listas/);
        });
    });

    // --- GET /api/cursos/desactivar/:id ---
    describe('GET /api/cursos/desactivar/:id', () => {
        it('DC1 - debe archivar un curso correctamente', async () => {
        const curso = await prisma.curso.create({
            data: {
            nombre: 'Go',
            codigo_curso: 'GO001',
            descripcion: 'Curso de Go',
            activo: true,
            fecha_creacion: new Date(),
            creado_por: 'Admin'
            }
        });

        const response = await request(app)
            .get(`/api/cursos/desactivar/${curso.id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('message', 'Curso archivado');
        });

        it('DC2 - debe retornar 404 si el curso no existe', async () => {
        const response = await request(app)
            .get('/api/cursos/desactivar/9999')
            .expect('Content-Type', /json/)
            .expect(404);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.data).toBeNull();
        expect(body.error).toMatch(/Curso no encontrado/);
        });
    });
});
