"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const topicos_routes_1 = __importDefault(require("../../routes/topicos.routes"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/topicos', topicos_routes_1.default);
describe('Tópicos API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.topico.deleteMany({});
        await prisma_1.default.unidad.deleteMany({});
        await prisma_1.default.edicion.deleteMany({});
        await prisma_1.default.curso.deleteMany({});
        await prisma_1.default.usuario.deleteMany({});
        await prisma_1.default.cargo.deleteMany({});
    });
    // PUT REORDENAR TOPICOS
    describe('PUT /api/topicos/reordenar', () => {
        it('T1: reordenamiento exitoso', async () => {
            const curso = await prisma_1.default.curso.create({
                data: {
                    nombre: 'Curso Reorder',
                    codigo_curso: 'CR',
                    descripcion: 'Demo',
                    activo: true
                }
            });
            const edicion = await prisma_1.default.edicion.create({
                data: {
                    curso: { connect: { id: curso.id } },
                    nombre_edicion: 'Edicion Reorder',
                    descripcion: 'Demo',
                    fecha_apertura: new Date(),
                    activo: true,
                    creado_por: 'Admin'
                }
            });
            const unidad = await prisma_1.default.unidad.create({
                data: {
                    edicion: { connect: { id: edicion.id } },
                    titulo: 'Unidad 1',
                    descripcion: 'Unidad demo',
                    orden: 1,
                    activo: true
                }
            });
            const topico1 = await prisma_1.default.topico.create({
                data: {
                    unidad: { connect: { id: unidad.id } },
                    titulo: 'Tópico 1',
                    descripcion: 'Descripción 1',
                    duracion_estimada: 60,
                    orden: 1,
                    publicado: false,
                    activo: true
                }
            });
            const topico2 = await prisma_1.default.topico.create({
                data: {
                    unidad: { connect: { id: unidad.id } },
                    titulo: 'Tópico 2',
                    descripcion: 'Descripción 2',
                    duracion_estimada: 60,
                    orden: 2,
                    publicado: false,
                    activo: true
                }
            });
            const topico3 = await prisma_1.default.topico.create({
                data: {
                    unidad: { connect: { id: unidad.id } },
                    titulo: 'Tópico 3',
                    descripcion: 'Descripción 3',
                    duracion_estimada: 60,
                    orden: 3,
                    publicado: false,
                    activo: true
                }
            });
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const reordered = [
                { id: topico2.id, orden: 1 },
                { id: topico1.id, orden: 2 },
                { id: topico3.id, orden: 3 },
            ];
            const res = await (0, supertest_1.default)(app)
                .put('/api/topicos/reordenar')
                .send(reordered)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            const body = res.body;
            expect(body.success).toBe(true);
            expect(body.data.message).toMatch(/Topicos reordenados correctamente/);
            const topicosDb = await prisma_1.default.topico.findMany({ where: { id_unidad: unidad.id }, orderBy: { orden: 'asc' } });
            expect(topicosDb[0].id).toBe(topico2.id);
            expect(topicosDb[1].id).toBe(topico1.id);
            expect(topicosDb[2].id).toBe(topico3.id);
        });
        it('T2: error por array vacío', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const res = await (0, supertest_1.default)(app)
                .put('/api/topicos/reordenar')
                .send([])
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Debe enviar al menos un topico para reordenar/);
        });
        it('T3: error por tópico sin id o sin orden', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const invalidTopicos = [
                { id: 1 }, // falta orden
                { orden: 2 } // falta id
            ];
            const res = await (0, supertest_1.default)(app)
                .put('/api/topicos/reordenar')
                .send(invalidTopicos)
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Cada topico debe tener id y orden válidos/);
        });
        it('T4: error por tópico inexistente en BD', async () => {
            const { token } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const invalidTopicos = [
                { id: 9999, orden: 1 },
                { id: 10000, orden: 2 },
            ];
            const res = await (0, supertest_1.default)(app)
                .put('/api/topicos/reordenar')
                .send(invalidTopicos)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            const body = res.body;
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/Uno o más topicos no existen/);
        });
    });
});
