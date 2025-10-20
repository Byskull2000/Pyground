"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const inscripciones_routes_1 = __importDefault(require("../../routes/inscripciones.routes"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/inscripciones', inscripciones_routes_1.default);
describe('Inscripciones API - Integration Tests', () => {
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
    // CREAR INSCRIPCIÓN
    describe('POST /api/inscripciones', () => {
        it('IS5: creación exitosa de una inscripción', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const cargo = await prisma_1.default.cargo.create({ data: { nombre: 'Participante' } });
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Prueba', codigo_curso: 'PRUEBA', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición 2025', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });
            const newInscripcion = { usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id };
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newInscripcion)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.usuario_id).toBe(usuario.id);
            expect(body.error).toBeNull();
        });
        it('IS6: faltan campos obligatorios', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ edicion_id: 1, cargo_id: 1 })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/El usuario es obligatorio/);
        });
        it('IS7: usuario no encontrado', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso Prueba', codigo_curso: 'PRUEBA', descripcion: 'Demo' } });
            const cargo = await prisma_1.default.cargo.create({ data: { nombre: 'Participante' } });
            const edicion = await prisma_1.default.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición 2025', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ usuario_id: 9999, edicion_id: edicion.id, cargo_id: cargo.id })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Usuario no encontrado|inactivo/);
        });
        it('IS8: edición no encontrada o inactiva', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const cargo = await prisma_1.default.cargo.create({ data: { nombre: 'Participante' } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ usuario_id: usuario.id, edicion_id: 9999, cargo_id: cargo.id })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Edición no encontrada|inactiva/);
        });
        it('IS9: edición no publicada', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const cargo = await prisma_1.default.cargo.create({ data: { nombre: 'Estudiante' } });
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: false, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id })
                .expect('Content-Type', /json/)
                .expect(409);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/no esta abierta a inscripciones/);
        });
        it('IS10: cargo no encontrado', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: 9999 })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Cargo no encontrado/);
        });
        it('IS11: usuario ya inscrito en la edición', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const usuario = await prisma_1.default.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
            const cargo = await prisma_1.default.cargo.create({ data: { nombre: 'Participante' } });
            const curso = await prisma_1.default.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
            const edicion = await prisma_1.default.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });
            await prisma_1.default.inscripcion.create({ data: { usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id } });
            const response = await (0, supertest_1.default)(app)
                .post('/api/inscripciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id })
                .expect('Content-Type', /json/)
                .expect(409);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/ya está inscrito/);
        });
    });
});
