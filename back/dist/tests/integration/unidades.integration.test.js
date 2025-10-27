"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const unidades_routes_1 = __importDefault(require("../../routes/unidades.routes"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/unidades', unidades_routes_1.default);
describe('Unidad API - Integration Tests', () => {
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
    // GET UNIDADES POR EDICION
    describe('GET /api/unidades/edicion/:id_edicion', () => {
        it('U17: listar unidades de una edición existente', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso 1', codigo_curso: 'C1', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion 1', activo: true, fecha_apertura: new Date("2025-01-10"), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 1', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades/edicion/${edicion.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.length).toBe(1);
            expect(body.data[0].titulo).toBe('Unidad 1');
        });
        it('U18: edición sin unidades', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso vacío', codigo_curso: 'CV', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion vacía', activo: true, fecha_apertura: new Date("2025-01-11"), creado_por: 'Admin', id_curso: curso.id } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades/edicion/${edicion.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
        });
        it('U19: edición inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades/edicion/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Edición no encontrada/);
        });
    });
    // GET UNIDAD POR ID
    describe('GET /api/unidades/:id', () => {
        it('U20: consulta exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso 2', codigo_curso: 'C2', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-12"), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 1', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.id).toBe(unidad.id);
            expect(body.data.titulo).toBe('Unidad 1');
        });
        it('U21: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .get(`/api/unidades/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
    // POST CREAR UNIDAD
    describe('POST /api/unidades', () => {
        it('U1: creación exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Crear', codigo_curso: 'CC', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Crear', activo: true, fecha_apertura: new Date("2025-01-13"), creado_por: 'Admin', id_curso: curso.id } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const newUnidad = { id_edicion: edicion.id, titulo: 'Nueva Unidad', orden: 1 };
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send(newUnidad)
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.titulo).toBe('Nueva Unidad');
        });
        it('U2: faltan título', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C3', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-14"), creado_por: 'Admin', id_curso: curso.id } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send({ id_edicion: edicion.id, orden: 1 })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/El título es obligatorio/);
        });
        it('U3: faltan id_edicion', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send({ titulo: 'Unidad', orden: 1 })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/La edición es obligatoria/);
        });
        it('U4: faltan orden', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C4', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-15"), creado_por: 'Admin', id_curso: curso.id } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send({ id_edicion: edicion.id, titulo: 'Unidad' })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/El orden es obligatorio/);
        });
        it('U5: unidad duplicada', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Dup', codigo_curso: 'CD', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Duplicada', activo: true, fecha_apertura: new Date("2025-01-16"), creado_por: 'Admin', id_curso: curso.id } });
            await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Duplicada', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send({ id_edicion: edicion.id, titulo: 'Duplicada', orden: 2 })
                .set('Authorization', `Bearer ${token}`)
                .expect(409);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Ya existe una unidad con este titulo/);
        });
        it('U6: error interno', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .post(`/api/unidades`)
                .send({ id_edicion: 'invalid', titulo: 'Unidad', orden: 1 })
                .set('Authorization', `Bearer ${token}`)
                .expect(500);
            const body = res.body;
            expect(body.success).toBe(false);
        });
    });
    // PUT UPDATE UNIDAD
    describe('PUT /api/unidades/:id', () => {
        it('U7: actualización exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Update', codigo_curso: 'CU', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Update', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Vieja', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/${unidad.id}`)
                .send({ titulo: 'Nueva' })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.titulo).toBe('Nueva');
        });
        it('U8: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/9999`)
                .send({ titulo: 'Nuevo' })
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
    // DELETE UNIDAD
    describe('DELETE /api/unidades/:id', () => {
        it('U9: eliminación exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Delete', codigo_curso: 'CD', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Delete', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Eliminar', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .delete(`/api/unidades/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Unidad eliminada correctamente/);
        });
        it('U10: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .delete(`/api/unidades/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
    // PUT RESTAURAR UNIDAD
    describe('PUT /api/unidades/restaurar/:id', () => {
        it('U11: restauración exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Restore', codigo_curso: 'CR', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Restore', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: false } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/restaurar/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Unidad restaurada correctamente/);
        });
        it('U12: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/restaurar/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
    // PUT PUBLICAR UNIDAD
    describe('PUT /api/unidades/publicar/:id', () => {
        it('U13: publicación exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Public', codigo_curso: 'CP', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Public', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: false } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/publicar/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Unidad publicada correctamente/);
        });
        it('U14: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/publicar/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
    // PUT DESACTIVAR UNIDAD
    describe('PUT /api/unidades/desactivar/:id', () => {
        it('U15: desactivación exitosa', async () => {
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Deactivate', codigo_curso: 'CD', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { nombre_edicion: 'Edicion Deactivate', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
            const unidad = await prisma_1.default.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: true } });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/desactivar/${unidad.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Unidad archivada correctamente/);
        });
        it('U16: unidad inexistente', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put(`/api/unidades/desactivar/9999`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Unidad no encontrada/);
        });
    });
});
