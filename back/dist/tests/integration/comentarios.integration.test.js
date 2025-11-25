"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const comentarioController = __importStar(require("../../controllers/comentarios.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Rutas simuladas para los tests
app.post('/api/comentarios', comentarioController.createComentario);
app.post('/api/comentarios/topico', comentarioController.getComentariosByTopico);
describe('Comentarios API - Integration Tests', () => {
    let adminToken;
    let userToken;
    let topicoId;
    let usuarioId;
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.visto.deleteMany({});
        await prisma_1.default.comentario.deleteMany({});
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
    // TEST - CREACIÓN DE COMENTARIO
    describe('POST /api/comentarios', () => {
        it('C1: Creación exitosa', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const newComentario = {
                id_topico: topicoId,
                id_usuario: usuario.id,
                texto: 'Buen aporte'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send(newComentario)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('texto', newComentario.texto);
            expect(body.error).toBeNull();
        });
        it('C2: No se puede publicar comentarios vacíos', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_topico: topicoId, id_usuario: usuario.id, texto: '' })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toBe('No se puede publicar comentarios vacios');
        });
        it('C3: Falta id_topico', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_usuario: usuario.id, texto: 'Test' })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toBe('El topico es obligatorio');
        });
        it('C4: Falta id_usuario', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_topico: topicoId, texto: 'Test' })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toBe('Usuario no reconocido');
        });
        it('C5: Topico no encontrado', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_topico: 999, id_usuario: usuario.id, texto: 'Test' })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toBe('Topico no encontrado');
        });
        it('C6: Usuario no encontrado', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_topico: topicoId, id_usuario: 999, texto: 'Test' })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.error).toBe('Usuario no encontrado');
        });
        it('C7: Error interno', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios')
                .send({ id_topico: topicoId, id_usuario: usuario.id, texto: null })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
        });
    });
    // TEST - OBTENER COMENTARIOS POR TÓPICO
    describe('POST /api/comentarios/topico', () => {
        it('C8: Listar comentarios de un tópico existente', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const comentario1 = await prisma_1.default.comentario.create({ data: { id_topico: topicoId, id_usuario: usuario.id, texto: 'Muy buen aporte' } });
            const comentario2 = await prisma_1.default.comentario.create({ data: { id_topico: topicoId, id_usuario: usuario.id, texto: 'Estoy de acuerdo' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_topico: topicoId, id_usuario: usuario.id })
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data.length).toBe(2);
        });
        it('C9: Falta id_topico', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_usuario: usuario.id })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.error).toBe('El topico es obligatorio');
        });
        it('C10: Falta id_usuario', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_topico: topicoId })
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.error).toBe('Usuario no reconocido');
        });
        it('C11: Topico no encontrado', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_topico: 999, id_usuario: usuario.id })
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.error).toBe('Topico no encontrado');
        });
        it('C12: Usuario no encontrado', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_topico: topicoId, id_usuario: 999 })
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.error).toBe('Usuario no encontrado');
        });
        it('C13: Tópico sin comentarios', async () => {
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/comentarios/topico')
                .send({ id_topico: topicoId, id_usuario: usuario.id })
                .expect('Content-Type', /json/)
                .expect(200);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toEqual([]);
        });
    });
});
