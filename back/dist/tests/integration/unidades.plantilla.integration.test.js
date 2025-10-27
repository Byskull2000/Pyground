"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const unidades_plantilla_routes_1 = __importDefault(require("../../routes/unidades.plantilla.routes"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/unidades-plantilla', unidades_plantilla_routes_1.default);
describe('UnidadPlantilla API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.inscripcion.deleteMany({});
        await prisma_1.default.topico.deleteMany({});
        await prisma_1.default.unidad.deleteMany({});
        await prisma_1.default.topicoPlantilla.deleteMany({});
        await prisma_1.default.unidadPlantilla.deleteMany({});
        await prisma_1.default.edicion.deleteMany({});
        await prisma_1.default.curso.deleteMany({});
        await prisma_1.default.usuario.deleteMany({});
        await prisma_1.default.cargo.deleteMany({});
    });
    // GET UNIDADES POR CURSO
    describe('GET /api/unidades-plantilla/curso/:id_curso', () => {
        it('UP11: listar unidades de un curso existente', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Test', codigo_curso: 'CURSO1', descripcion: 'Demo' } });
            const unidad = await prisma_1.default.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Intro', orden: 1, version: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades-plantilla/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.length).toBe(1);
            expect(body.data[0].titulo).toBe('Intro');
        });
        it('UP12: curso sin unidades', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso vacío', codigo_curso: 'CURSO2', descripcion: 'Demo' } });
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades-plantilla/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
        });
    });
    // GET UNIDAD POR ID
    describe('GET /api/unidades-plantilla/:id', () => {
        it('UP1: obtener unidad existente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C1', descripcion: 'Demo' } });
            const unidad = await prisma_1.default.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Intro', orden: 1, version: 1, activo: true } });
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades-plantilla/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.id).toBe(unidad.id);
            expect(body.data.titulo).toBe('Intro');
        });
        it('UP8/UP10: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades-plantilla/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Unidad plantilla no encontrada/);
        });
    });
    // POST CREAR UNIDAD
    describe('POST /api/unidades-plantilla', () => {
        it('UP1: creación exitosa', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Crear', codigo_curso: 'C2', descripcion: 'Demo' } });
            const newUnidad = { id_curso: curso.id, titulo: 'Nueva Unidad', orden: 1 };
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .send(newUnidad)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.titulo).toBe('Nueva Unidad');
        });
        it('UP2: faltan título', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .send({ id_curso: 1, titulo: '', orden: 1 })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/El título es obligatorio/);
        });
        it('UP3: faltan id_curso', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .set('Authorization', `Bearer ${token}`)
                .send({ titulo: 'Unidad', orden: 1 })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/El curso es obligatorio/);
        });
        it('UP4: faltan orden', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C3', descripcion: 'Demo' } });
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .send({ id_curso: curso.id, titulo: 'Unidad', orden: null })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/El orden es obligatorio/);
        });
        it('UP5: unidad duplicada', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Duplicado', codigo_curso: 'C4', descripcion: 'Demo' } });
            await prisma_1.default.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Duplicada', orden: 1, version: 1, activo: true } });
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .send({ id_curso: curso.id, titulo: 'Duplicada', orden: 2 })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(409);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Ya existe una unidad con ese nombre/);
        });
        it('UP6: error interno', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post('/api/unidades-plantilla')
                .send({ id_curso: 'invalid', titulo: 'Unidad', orden: 1 })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(500);
            const body = res.body;
            expect(body.success).toBe(false);
        });
    });
    // PUT UPDATE UNIDAD
    describe('PUT /api/unidades-plantilla/:id', () => {
        it('UP7: actualización exitosa', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Update', codigo_curso: 'C5', descripcion: 'Demo' } });
            const unidad = await prisma_1.default.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Vieja', orden: 1, version: 1, activo: true } });
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades-plantilla/${unidad.id}`)
                .send({ titulo: 'Nueva' })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.titulo).toBe('Nueva');
        });
        it('UP8: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put('/api/unidades-plantilla/9999')
                .send({ titulo: 'Nuevo' })
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad plantilla no encontrada/);
        });
    });
    // DELETE UNIDAD
    describe('DELETE /api/unidades-plantilla/:id', () => {
        it('UP9: eliminación exitosa', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Delete', codigo_curso: 'C6', descripcion: 'Demo' } });
            const unidad = await prisma_1.default.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Eliminar', orden: 1, version: 1, activo: true } });
            const res = await (0, supertest_1.default)(app)
                .delete(`/api/unidades-plantilla/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/eliminada correctamente/);
        });
        it('UP10: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .delete('/api/unidades-plantilla/9999')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad plantilla no encontrada/);
        });
    });
});
