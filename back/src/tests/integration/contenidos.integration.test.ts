// back/src/tests/integration/contenidos.integration.test.ts
import request from 'supertest';
import express from 'express';
import contenidosRoutes from '../../routes/contenidos.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';
import { createAdminUserAndToken, createUserAndToken } from '../helpers/auth.helper';

const app = express();
app.use(express.json());
app.use('/api/contenidos', contenidosRoutes);

describe('Contenidos API - Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let topicoId: number;
  let contenidoId: number;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
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

    const { token: adminTkn } = await createAdminUserAndToken();
    adminToken = adminTkn;

    const { token: userTkn } = await createUserAndToken();
    userToken = userTkn;

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

  
  // CT1 - Registro exitoso
  
  it('CT1 - Creación exitosa de contenidos', async () => {
    const contenidosData = [
      { tipo: 'TEXTO', orden: 1, titulo: 'Contenido A' },
      { tipo: 'VIDEO', orden: 2, titulo: 'Contenido B' }
    ];

    const response = await request(app)
      .post('/api/contenidos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_topico: topicoId, contenidos: contenidosData })
      .expect(201);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data.count).toBe(2);
  });

  
  // CT2 - Falta id_topico
  
  it('CT2 - Falta id_topico', async () => {
    const response = await request(app)
      .post('/api/contenidos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ contenidos: [{ tipo: 'TEXTO', orden: 1 }] })
      .expect(400);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('El id_topico es obligatorio');
  });

  
  // CT3 - No hay contenidos
  
  it('CT3 - No hay contenidos', async () => {
    const response = await request(app)
      .post('/api/contenidos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_topico: topicoId, contenidos: [] })
      .expect(400);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Debe incluir al menos un contenido');
  });

  
  // CT4 - Tópico inexistente
  
  it('CT4 - Tópico inexistente', async () => {
    const response = await request(app)
      .post('/api/contenidos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_topico: 9999, contenidos: [{ tipo: 'TEXTO', orden: 1 }] })
      .expect(404);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Tópico no encontrado');
  });

  
  // CT5 - Actualización exitosa
  
  it('CT5 - Actualización exitosa', async () => {
    const contenido = await prisma.contenido.create({
      data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Original', activo: true }
    });
    contenidoId = contenido.id;

    const updateData = { titulo: 'Actualizado', orden: 2, activo: false };

    const response = await request(app)
      .put(`/api/contenidos/${contenidoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData)
      .expect(200);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data.titulo).toBe('Actualizado');
    expect(body.data.orden).toBe(2);
    expect(body.data.activo).toBe(false);
  });

  
  // CT6 - Contenido inexistente
  
  it('CT6 - Contenido inexistente', async () => {
    const response = await request(app)
      .put('/api/contenidos/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ titulo: 'Nuevo' })
      .expect(404);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Contenido no encontrado');
  });

  
  // CT7 - Eliminación exitosa
  
  it('CT7 - Eliminación lógica exitosa', async () => {
    const contenido = await prisma.contenido.create({
      data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Para eliminar', activo: true }
    });
    contenidoId = contenido.id;

    const response = await request(app)
      .delete(`/api/contenidos/${contenidoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data.activo).toBe(false);
  });

  
  // CT8 - Contenido inexistente
  
  it('CT8 - Contenido inexistente', async () => {
    const response = await request(app)
      .delete('/api/contenidos/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Contenido no encontrado');
  });

  
  // CT9 - Contenido ya inactivo
  
  it('CT9 - Contenido ya inactivo', async () => {
    const contenido = await prisma.contenido.create({
      data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Inactivo', activo: false }
    });
    contenidoId = contenido.id;

    const response = await request(app)
      .delete(`/api/contenidos/${contenidoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('El contenido ya está inactivo');
  });

  
  // CT10 - Listar contenidos de un tópico existente
  
  it('CT10 - Obtener contenidos de un tópico', async () => {
    await prisma.contenido.createMany({
      data: [
        { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'C1', activo: true },
        { id_topico: topicoId, tipo: 'VIDEO', orden: 2, titulo: 'C2', activo: true }
      ]
    });

    const response = await request(app)
      .get(`/api/contenidos/topico/${topicoId}`)
      .expect(200);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);
  });

  
  // CT11 - Tópico sin contenidos
  
  it('CT11 - Tópico sin contenidos', async () => {
    const response = await request(app)
      .get(`/api/contenidos/topico/${topicoId}`)
      .expect(200);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  
  // CT12 - Tópico inexistente
  
  it('CT12 - Tópico inexistente', async () => {
    const response = await request(app)
      .get('/api/contenidos/topico/9999')
      .expect(404);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Tópico no encontrado');
  });

  
  // CT13 - Obtener contenido por ID
  
  it('CT13 - Contenido existente por ID', async () => {
    const contenido = await prisma.contenido.create({
      data: { id_topico: topicoId, tipo: 'TEXTO', orden: 1, titulo: 'Existente', activo: true }
    });
    contenidoId = contenido.id;

    const response = await request(app)
      .get(`/api/contenidos/${contenidoId}`)
      .expect(200);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data.titulo).toBe('Existente');
  });

  
  // CT14 - Contenido inexistente por ID
  
  it('CT14 - Contenido inexistente por ID', async () => {
    const response = await request(app)
      .get('/api/contenidos/9999')
      .expect(404);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Contenido no encontrado');
  });
});
