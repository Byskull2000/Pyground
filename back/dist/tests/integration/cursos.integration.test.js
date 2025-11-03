"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cursos_routes_1 = __importDefault(require("../../routes/cursos.routes"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_helper_1 = require("../helpers/auth.helper");
// Crear app de prueba
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/cursos', cursos_routes_1.default);
describe('Cursos API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.contenido.deleteMany({});
        await prisma_1.default.topico.deleteMany({});
        await prisma_1.default.topicoPlantilla.deleteMany({});
        await prisma_1.default.inscripcion.deleteMany({});
        await prisma_1.default.unidad.deleteMany({});
        await prisma_1.default.unidadPlantilla.deleteMany({});
        await prisma_1.default.edicion.deleteMany({});
        await prisma_1.default.curso.deleteMany({});
    });
    describe('GET /api/cursos', () => {
        it('debe retornar lista vacía si no hay cursos', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/cursos')
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
            expect(body.error).toBeNull();
        });
        it('debe retornar lista de cursos', async () => {
            await prisma_1.default.curso.createMany({
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
            const response = await (0, supertest_1.default)(app)
                .get('/api/cursos')
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
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
            const created = await prisma_1.default.curso.create({
                data: {
                    nombre: 'Java',
                    codigo_curso: 'JAV001',
                    descripcion: 'Curso de Java',
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: 'Admin'
                }
            });
            const response = await (0, supertest_1.default)(app)
                .get(`/api/cursos/${created.id}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id', created.id);
            expect(body.data).toHaveProperty('nombre', 'Java');
            expect(body.error).toBeNull();
        });
        it('debe retornar 404 si el curso no existe (VC2)', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/cursos/99999')
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toBe('Curso no encontrado');
        });
        it('VC5 - Error del servidor al obtener datos', async () => {
            const originalFindUnique = prisma_1.default.curso.findUnique;
            prisma_1.default.curso.findUnique = jest.fn(() => {
                throw new Error('Error simulado en la base de datos');
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/cursos/1')
                //.set('Authorization', `Bearer ${tokenValido}`)
                .expect('Content-Type', /json/)
                .expect(500);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch("Error al obtener curso");
            prisma_1.default.curso.findUnique = originalFindUnique;
        });
    });
    // --- PUT /api/cursos/publicar/:id ---
    describe('PUT /api/cursos/publicar/:id', () => {
        it('PC1 - debe publicar un curso correctamente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: {
                    nombre: 'C++',
                    codigo_curso: 'CPP001',
                    descripcion: 'Curso de C++',
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: 'Admin'
                }
            });
            const unidad = await prisma_1.default.unidadPlantilla.create({
                data: {
                    titulo: 'Unidad 1',
                    descripcion: 'Intro',
                    id_curso: curso.id,
                    orden: 1,
                    version: 1
                }
            });
            await prisma_1.default.topicoPlantilla.create({
                data: {
                    titulo: 'Topico 1',
                    descripcion: 'Intro',
                    id_unidad_plantilla: unidad.id,
                    orden: 1,
                    version: 1,
                    duracion_estimada: 15
                }
            });
            const response = await (0, supertest_1.default)(app)
                .put(`/api/cursos/publicar/${curso.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Curso publicado correctamente');
        });
        it('PC2 - debe retornar 404 si el curso no existe', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .put('/api/cursos/publicar/9999')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Curso no encontrado|no tiene unidades listas/);
        });
    });
    // --- PUT /api/cursos/desactivar/:id ---
    describe('PUT /api/cursos/desactivar/:id', () => {
        it('DC1 - debe archivar un curso correctamente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: {
                    nombre: 'Go',
                    codigo_curso: 'GO001',
                    descripcion: 'Curso de Go',
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: 'Admin'
                }
            });
            const response = await (0, supertest_1.default)(app)
                .put(`/api/cursos/desactivar/${curso.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('message', 'Curso archivado');
        });
        it('DC2 - debe retornar 404 si el curso no existe', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .put('/api/cursos/desactivar/9999')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Curso no encontrado/);
        });
    });
});
