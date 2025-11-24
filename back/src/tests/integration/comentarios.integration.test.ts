import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import * as comentarioController from '../../controllers/comentarios.controller';
import { ApiResponse } from '../../utils/apiResponse';

const app = express();
app.use(express.json());

// Rutas simuladas para los tests
app.post('/api/comentarios', comentarioController.createComentario);
app.post('/api/comentarios/topico', comentarioController.getComentariosByTopico);

describe('Comentarios API - Integration Tests', () => {
    let adminToken: string;
    let userToken: string;
    let topicoId: number;
    let usuarioId: number;

    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        
        await prisma.visto.deleteMany({});
        await prisma.comentario.deleteMany({});
        
        await prisma.contenido.deleteMany({});
        await prisma.inscripcion.deleteMany({});
        await prisma.topico.deleteMany({});
        await prisma.unidad.deleteMany({});
        await prisma.topicoPlantilla.deleteMany({});
        await prisma.unidadPlantilla.deleteMany({});
        
        await prisma.edicion.deleteMany({});
        await prisma.curso.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.cargo.deleteMany({});


        const curso = await prisma.curso.create({
            data: {
            nombre: 'Curso Test',
            codigo_curso: 'CURSO-TEST-01',
            descripcion: 'Curso de prueba',
            activo: true                
        }
        });
        
        const edicion = await prisma.edicion.create({
            data: {
            curso: { connect: { id: curso.id } },
            nombre_edicion: 'Edición Test',
            descripcion: 'Edición de prueba',
            fecha_apertura: new Date(),
            activo: true,
            creado_por: 'Admin Test'
            }
        });
        
        const unidad = await prisma.unidad.create({
            data: {
            edicion: { connect: { id: edicion.id } },
            titulo: 'Unidad Test',    
            descripcion: 'Unidad de prueba',
            orden: 1,
            activo: true
        }
        });
            
        const topico = await prisma.topico.create({
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
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const newComentario = {
            id_topico: topicoId,
            id_usuario: usuario.id,
            texto: 'Buen aporte'
        };

        const response = await request(app)
            .post('/api/comentarios')
            .send(newComentario)
            .expect('Content-Type', /json/)
            .expect(201);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('texto', newComentario.texto);
        expect(body.error).toBeNull();
        });

        it('C2: No se puede publicar comentarios vacíos', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_topico: topicoId, id_usuario: usuario.id, texto: '' })
            .expect('Content-Type', /json/)
            .expect(400);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('No se puede publicar comentarios vacios');
        });

        it('C3: Falta id_topico', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_usuario: usuario.id, texto: 'Test' })
            .expect('Content-Type', /json/)
            .expect(400);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('El topico es obligatorio');
        });

        it('C4: Falta id_usuario', async () => {

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_topico: topicoId, texto: 'Test' })
            .expect('Content-Type', /json/)
            .expect(400);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Usuario no reconocido');
        });

        it('C5: Topico no encontrado', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_topico: 999, id_usuario: usuario.id, texto: 'Test' })
            .expect('Content-Type', /json/)
            .expect(404);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Topico no encontrado');
        });

        it('C6: Usuario no encontrado', async () => {

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_topico: topicoId, id_usuario: 999, texto: 'Test' })
            .expect('Content-Type', /json/)
            .expect(404);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        expect(body.error).toBe('Usuario no encontrado');
        });

        it('C7: Error interno', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios')
            .send({ id_topico: topicoId, id_usuario: usuario.id, texto: null })
            .expect('Content-Type', /json/)
            .expect(400);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(false);
        });
    });

    // TEST - OBTENER COMENTARIOS POR TÓPICO
    describe('POST /api/comentarios/topico', () => {
        it('C8: Listar comentarios de un tópico existente', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const comentario1 = await prisma.comentario.create({ data: { id_topico: topicoId, id_usuario: usuario.id, texto: 'Muy buen aporte' } });
        const comentario2 = await prisma.comentario.create({ data: { id_topico: topicoId, id_usuario: usuario.id, texto: 'Estoy de acuerdo' } });

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_topico: topicoId, id_usuario: usuario.id })
            .expect('Content-Type', /json/)
            .expect(200);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(true);
        expect(body.data.length).toBe(2);
        });

        it('C9: Falta id_topico', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_usuario: usuario.id })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.error).toBe('El topico es obligatorio');
        });

        it('C10: Falta id_usuario', async () => {

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_topico: topicoId })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.error).toBe('Usuario no reconocido');
        });

        it('C11: Topico no encontrado', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_topico: 999, id_usuario: usuario.id })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.error).toBe('Topico no encontrado');
        });

        it('C12: Usuario no encontrado', async () => {

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_topico: topicoId, id_usuario: 999 })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.error).toBe('Usuario no encontrado');
        });

        it('C13: Tópico sin comentarios', async () => {
        const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });

        const response = await request(app)
            .post('/api/comentarios/topico')
            .send({ id_topico: topicoId, id_usuario: usuario.id })
            .expect('Content-Type', /json/)
            .expect(200);

        const body: ApiResponse<any> = response.body;
        expect(body.success).toBe(true);
        expect(body.data).toEqual([]);
        });
    });
});
