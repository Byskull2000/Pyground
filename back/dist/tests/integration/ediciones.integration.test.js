"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const ediciones_routes_1 = __importDefault(require("../../routes/ediciones.routes"));
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/ediciones', ediciones_routes_1.default);
describe('Ediciones API - Integration Tests', () => {
    beforeAll(async () => {
        await prisma_1.default.$connect();
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    beforeEach(async () => {
        await prisma_1.default.topico.deleteMany({});
        await prisma_1.default.topicoPlantilla.deleteMany({});
        await prisma_1.default.inscripcion.deleteMany({});
        await prisma_1.default.unidad.deleteMany({});
        await prisma_1.default.unidadPlantilla.deleteMany({});
        await prisma_1.default.edicion.deleteMany({});
        await prisma_1.default.curso.deleteMany({});
    });
    describe('POST /api/ediciones', () => {
        it('ED1: creación exitosa de una edición', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo', estado_publicado: true }
            });
            await prisma_1.default.edicion.deleteMany({});
            const newEdicion = {
                id_curso: curso.id,
                nombre_edicion: 'Edición Prueba 2025',
                descripcion: 'Primera edición del curso',
                fecha_apertura: new Date('2025-01-10'),
                fecha_cierre: new Date('2025-10-20'),
                creado_por: 'admin@correo.com'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newEdicion)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.nombre_edicion).toBe('Edición Prueba 2025');
            expect(body.error).toBeNull();
        });
        it('ED2: faltan campos obligatorios', async () => {
            const { token: academicToken } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${academicToken}`)
                .send({
                fecha_apertura: '2025-02-10'
            })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Faltan campos obligatorios|El nombre de la edición es obligatorio/);
        });
        it('ED3: curso inexistente', async () => {
            const { token: academicToken } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${academicToken}`)
                .send({
                id_curso: 9999,
                nombre_edicion: 'Edición Prueba',
                fecha_apertura: '2025-01-10',
                fecha_cirre: '2025-10-10'
            })
                .expect('Content-Type', /json/)
                .expect(404);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Curso no encontrado/);
        });
        it('ED4: fecha de apertura inválida', async () => {
            const { token: academicToken } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo', estado_publicado: true }
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${academicToken}`)
                .send({
                id_curso: curso.id,
                nombre_edicion: 'Edición con fecha inválida',
                fecha_apertura: 'fecha_invalida'
            })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/La fecha de apertura es inválida/);
        });
        it('ED5: duplicado de edición dentro del mismo curso', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: { nombre: 'Curso Duplicado', codigo_curso: "DUPLICADO", descripcion: 'Test duplicado', estado_publicado: true }
            });
            await prisma_1.default.edicion.create({
                data: {
                    id_curso: curso.id,
                    nombre_edicion: 'Edicion 2025',
                    fecha_apertura: new Date('2025-01-10'),
                    fecha_cierre: new Date('2025-08-10'),
                    creado_por: 'admin@correo.com'
                }
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                id_curso: curso.id,
                nombre_edicion: 'Edicion 2025',
                fecha_apertura: '2025-01-10',
                fecha_cierre: '2025-08-10',
                creado_por: 'admin@correo.com'
            })
                .expect('Content-Type', /json/)
                .expect(409);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/Ya existe una edición con ese nombre para este curso/);
        });
        it('ED6: fecha de cierre antes de apertura', async () => {
            const { token: academicToken } = await (0, auth_helper_1.createAcademicoUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo' }
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${academicToken}`)
                .send({
                id_curso: curso.id,
                nombre_edicion: 'Edición temporal',
                fecha_apertura: new Date('2025-10-10'),
                fecha_cierre: new Date('2025-01-01'),
                creado_por: 'admin@correo.com'
            })
                .expect('Content-Type', /json/)
                .expect(400);
            const body = response.body;
            expect(body.success).toBe(false);
            expect(body.data).toBeNull();
            expect(body.error).toMatch(/La fecha de apertura no puede ser mayor a la fecha de cierre/);
        });
        it('ED11: creación de edición con unidades clonadas desde plantilla', async () => {
            const { token: adminToken } = await (0, auth_helper_1.createAdminUserAndToken)();
            const curso = await prisma_1.default.curso.create({
                data: {
                    nombre: 'Curso',
                    codigo_curso: 'CURSO',
                    descripcion: 'Curso base con unidades plantilla',
                    estado_publicado: true
                }
            });
            await prisma_1.default.unidadPlantilla.createMany({
                data: [
                    { id_curso: curso.id, titulo: 'Unidad 1', descripcion: 'Introducción', orden: 1, version: 1 },
                    { id_curso: curso.id, titulo: 'Unidad 2', descripcion: 'Avanzado', orden: 2, version: 1 },
                    { id_curso: curso.id, titulo: 'Unidad 3', descripcion: 'Práctica final', orden: 3, version: 1 }
                ]
            });
            const newEdicion = {
                id_curso: curso.id,
                nombre_edicion: 'Edición 2025-I',
                descripcion: 'Edición con unidades clonadas desde plantilla',
                fecha_apertura: '2025-01-01T00:00:00.000Z',
                fecha_cierre: '2025-12-31T00:00:00.000Z',
                creado_por: 'admin@correo.com'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/ediciones')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newEdicion)
                .expect('Content-Type', /json/)
                .expect(201);
            const body = response.body;
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty('id');
            expect(body.data.nombre_edicion).toBe('Edición 2025-I');
            expect(body.error).toBeNull();
            const unidadesClonadas = await prisma_1.default.unidad.findMany({
                where: { id_edicion: body.data.id }
            });
            expect(unidadesClonadas.length).toBe(3);
            expect(unidadesClonadas.map(u => u.titulo)).toEqual(expect.arrayContaining(['Unidad 1', 'Unidad 2', 'Unidad 3']));
            if (body.data.mensaje_extra) {
                expect(body.data.mensaje_extra).toMatch(/\d+ unidades creadas desde la plantilla/);
            }
        });
    });
});
