"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// back/src/tests/integration/contenidos.integration.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const contenidos_routes_1 = __importDefault(require("../../routes/contenidos.routes"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/contenidos', contenidos_routes_1.default);
describe('Contenidos API - Integration Tests', () => {
    let adminToken;
    let userToken;
    let topicoId;
    let contenidoId;
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.contenido.deleteMany({});
        await prisma_1.default.inscripcion.deleteMany({});
        await prisma_1.default.topico.deleteMany({});
        await prisma_1.default.unidad.deleteMany({});
        await prisma_1.default.topicoPlantilla.deleteMany({});
        await prisma_1.default.unidadPlantilla.deleteMany({});
        await prisma_1.default.edicion.deleteMany({});
        await prisma_1.default.curso.deleteMany({});
        await prisma_1.default.usuario.deleteMany({});
        await prisma_1.default.cargo.deleteMany({});
        const { token: adminTkn } = await (0, auth_helper_1.createAdminUserAndToken)();
        adminToken = adminTkn;
        const { token: userTkn } = await (0, auth_helper_1.createUserAndToken)();
        userToken = userTkn;
        const curso = await prisma_1.default.curso.create({
            data: {
                nombre: 'Curso Test',
                codigo_curso: 'CURSO-TEST-01',
                descripcion: 'Curso de prueba',
                activo: true
            }
        });
        const edicion = await prisma_1.default.edicion.create({
            data: {
                curso: { connect: { id: curso.id } },
                nombre_edicion: 'Edición Test',
                descripcion: 'Edición de prueba',
                fecha_apertura: new Date(),
                activo: true,
                creado_por: 'Admin Test'
            }
        });
        const unidad = await prisma_1.default.unidad.create({
            data: {
                edicion: { connect: { id: edicion.id } },
                titulo: 'Unidad Test',
                descripcion: 'Unidad de prueba',
                orden: 1,
                activo: true
            }
        });
        const topico = await prisma_1.default.topico.create({
            data: {
                unidad: { connect: { id: unidad.id } },
                titulo: 'Tópico Test',
                descripcion: 'Descripción del tópico',
                duracion_estimada: 60,
                orden: 1,
                publicado: false,
                activo: true
            }
        });
        topicoId = topico.id;
    });
    // CT1 - Registro exitoso
    it('CT1 - Creación exitosa de contenidos', async () => {
        const contenidosData = [
            { tipo: 'TEXTO', orden: 1, titulo: 'Contenido A' },
            { tipo: 'VIDEO', orden: 2, titulo: 'Contenido B' }
        ];
        const response = await (0, supertest_1.default)(app)
            .post('/api/contenidos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_topico: topicoId, contenidos: contenidosData })
            .expect(201);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data.count).toBe(2);
    });
    // CT2 - Falta id_topico
    it('CT2 - Falta id_topico', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/contenidos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ contenidos: [{ tipo: 'TEXTO', orden: 1 }] })
            .expect(400);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('El id_topico es obligatorio');
    });
    // CT3 - No hay contenidos
    it('CT3 - No hay contenidos', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/contenidos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_topico: topicoId, contenidos: [] })
            .expect(400);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Debe incluir al menos un contenido');
    });
    // CT4 - Tópico inexistente
    it('CT4 - Tópico inexistente', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/contenidos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_topico: 9999, contenidos: [{ tipo: 'TEXTO', orden: 1 }] })
            .expect(404);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Tópico no encontrado');
    });
    // CT5 - Actualización exitosa
    it('CT5 - Actualización exitosa', async () => {
        const contenido = await prisma_1.default.contenido.create({
            data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Original', activo: true }
        });
        contenidoId = contenido.id;
        const updateData = { titulo: 'Actualizado', orden: 2, activo: false };
        const response = await (0, supertest_1.default)(app)
            .put(`/api/contenidos/${contenidoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updateData)
            .expect(200);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data.titulo).toBe('Actualizado');
        expect(body.data.orden).toBe(2);
        expect(body.data.activo).toBe(false);
    });
    // CT6 - Contenido inexistente
    it('CT6 - Contenido inexistente', async () => {
        const response = await (0, supertest_1.default)(app)
            .put('/api/contenidos/9999')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ titulo: 'Nuevo' })
            .expect(404);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Contenido no encontrado');
    });
    // CT7 - Eliminación exitosa
    it('CT7 - Eliminación lógica exitosa', async () => {
        const contenido = await prisma_1.default.contenido.create({
            data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Para eliminar', activo: true }
        });
        contenidoId = contenido.id;
        const response = await (0, supertest_1.default)(app)
            .delete(`/api/contenidos/${contenidoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data.activo).toBe(false);
    });
    // CT8 - Contenido inexistente
    it('CT8 - Contenido inexistente', async () => {
        const response = await (0, supertest_1.default)(app)
            .delete('/api/contenidos/9999')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Contenido no encontrado');
    });
    // CT9 - Contenido ya inactivo
    it('CT9 - Contenido ya inactivo', async () => {
        const contenido = await prisma_1.default.contenido.create({
            data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Inactivo', activo: false }
        });
        contenidoId = contenido.id;
        const response = await (0, supertest_1.default)(app)
            .delete(`/api/contenidos/${contenidoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(400);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('El contenido ya está inactivo');
    });
    // CT10 - Listar contenidos de un tópico existente
    it('CT10 - Obtener contenidos de un tópico', async () => {
        await prisma_1.default.contenido.createMany({
            data: [
                { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'C1', activo: true },
                { id_topico: topicoId, tipo: 'VIDEO', orden: 2, titulo: 'C2', activo: true }
            ]
        });
        const response = await (0, supertest_1.default)(app)
            .get(`/api/contenidos/topico/${topicoId}`)
            .expect(200);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(2);
    });
    // CT11 - Tópico sin contenidos
    it('CT11 - Tópico sin contenidos', async () => {
        const response = await (0, supertest_1.default)(app)
            .get(`/api/contenidos/topico/${topicoId}`)
            .expect(200);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toEqual([]);
    });
    // CT12 - Tópico inexistente
    it('CT12 - Tópico inexistente', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/contenidos/topico/9999')
            .expect(404);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Tópico no encontrado');
    });
    // CT13 - Obtener contenido por ID
    it('CT13 - Contenido existente por ID', async () => {
        const contenido = await prisma_1.default.contenido.create({
            data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Existente', activo: true }
        });
        contenidoId = contenido.id;
        const response = await (0, supertest_1.default)(app)
            .get(`/api/contenidos/${contenidoId}`)
            .expect(200);
        const body = response.body;
        expect(body.success).toBe(true);
        expect(body.data.titulo).toBe('Existente');
    });
    // CT14 - Contenido inexistente por ID
    it('CT14 - Contenido inexistente por ID', async () => {
        const response = await (0, supertest_1.default)(app)
            .get('/api/contenidos/9999')
            .expect(404);
        const body = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Contenido no encontrado');
    });
    // REORDENAMIENTO DE CONTENIDOS
    describe('PUT /api/contenidos/reordenar', () => {
        it('CT15 - Reordenamiento exitoso', async () => {
            const contenido1 = await prisma_1.default.contenido.create({
                data: { id_topico: topicoId, tipo: 'TEXTO', orden: 2, titulo: 'C1', activo: true }
            });
            const contenido2 = await prisma_1.default.contenido.create({
                data: { id_topico: topicoId, tipo: 'VIDEO', orden: 1, titulo: 'C2', activo: true }
            });
            const reordered = [
                { id: contenido2.id, orden: 1 },
                { id: contenido1.id, orden: 2 },
            ];
            const res = await (0, supertest_1.default)(app)
                .put(`/api/contenidos/reordenar`)
                .send(reordered)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Contenidos reordenados correctamente/);
            const contenidosDb = await prisma_1.default.contenido.findMany({
                where: { id_topico: topicoId },
                orderBy: { orden: 'asc' }
            });
            expect(contenidosDb[0].id).toBe(contenido2.id);
            expect(contenidosDb[1].id).toBe(contenido1.id);
        });
        it('CT16 - Error por array vacío', async () => {
            const res = await (0, supertest_1.default)(app)
                .put(`/api/contenidos/reordenar`)
                .send([])
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Debe enviar al menos un contenido para reordenar/);
        });
        it('CT17 - Error por contenido sin id o sin orden', async () => {
            const invalidContenidos = [
                { id: 1 }, // falta orden
                { orden: 2 } // falta id
            ];
            const res = await (0, supertest_1.default)(app)
                .put(`/api/contenidos/reordenar`)
                .send(invalidContenidos)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Cada contenido debe tener id y orden válidos/);
        });
        it('CT18 - Error por contenido inexistente', async () => {
            const invalidContenidos = [
                { id: 9999, orden: 1 },
                { id: 10000, orden: 2 },
            ];
            const res = await (0, supertest_1.default)(app)
                .put(`/api/contenidos/reordenar`)
                .send(invalidContenidos)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Uno o más contenidos no existen/);
        });
    });
});
