// back/src/tests/integration/topicos.plantilla.integration.test.ts
import request from 'supertest';
import express from 'express';
import topicosPlantillaRoutes from '../../routes/topicos.plantilla.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';
import { createAdminUserAndToken, createUserAndToken } from '../helpers/auth.helper';
import { RolesEnum } from '../../types/roles';

const app = express();
app.use(express.json());
app.use('/api/topicos-plantilla', topicosPlantillaRoutes);

describe('Topicos Plantilla API - Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let unidadPlantillaId: number;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar base de datos
    await prisma.topicoPlantilla.deleteMany({});
    await prisma.unidadPlantilla.deleteMany({});
    await prisma.curso.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Crear usuarios con tokens
    const { token: adminTkn } = await createAdminUserAndToken();
    adminToken = adminTkn;

    const { token: userTkn } = await createUserAndToken();
    userToken = userTkn;

    // Primero crear un curso para la unidad plantilla
    const curso = await prisma.curso.create({
      data: {
        nombre: 'Curso Test',
        descripcion: 'Curso de prueba',
        codigo_curso: 'TEST001',
        activo: true
      }
    });

    // Crear una unidad plantilla para las pruebas
    const unidadPlantilla = await prisma.unidadPlantilla.create({
      data: {
        id_curso: curso.id,
        titulo: 'Unidad Test',
        descripcion: 'Descripción test',
        orden: 1,
        version: 1,
        activo: true
      }
    });
    unidadPlantillaId = unidadPlantilla.id;

    jest.clearAllMocks();
  });

  describe('GET /api/topicos-plantilla/unidad/:id_unidad_plantilla', () => {
    it('debe obtener tópicos de una unidad plantilla (solo ADMIN)', async () => {
      // Crear tópicos de prueba
      await prisma.topicoPlantilla.createMany({
        data: [
          {
            id_unidad_plantilla: unidadPlantillaId,
            titulo: 'Tópico 1',
            duracion_estimada: 60,
            orden: 1,
            version: 1,
            activo: true
          },
          {
            id_unidad_plantilla: unidadPlantillaId,
            titulo: 'Tópico 2',
            duracion_estimada: 45,
            orden: 2,
            version: 1,
            activo: true
          }
        ]
      });

      const response = await request(app)
        .get(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(body.data[0].titulo).toBe('Tópico 1');
      expect(body.data[1].titulo).toBe('Tópico 2');
    });

    it('debe retornar array vacío si no hay tópicos', async () => {
      const response = await request(app)
        .get(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    });

    it('debe fallar sin autenticación', async () => {
      const response = await request(app)
        .get(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar con usuario sin permisos (no ADMIN)', async () => {
      const response = await request(app)
        .get(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('No tiene permisos para realizar esta acción');
    });

    it('debe retornar solo tópicos activos', async () => {
      await prisma.topicoPlantilla.createMany({
        data: [
          {
            id_unidad_plantilla: unidadPlantillaId,
            titulo: 'Tópico Activo',
            duracion_estimada: 60,
            orden: 1,
            version: 1,
            activo: true
          },
          {
            id_unidad_plantilla: unidadPlantillaId,
            titulo: 'Tópico Inactivo',
            duracion_estimada: 60,
            orden: 2,
            version: 1,
            activo: false
          }
        ]
      });

      const response = await request(app)
        .get(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].titulo).toBe('Tópico Activo');
    });
  });

  describe('POST /api/topicos-plantilla/unidad/:id_unidad_plantilla', () => {
    it('debe crear un nuevo tópico plantilla', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción del tópico',
        duracion_estimada: 60,
        version: 1,
        objetivos_aprendizaje: 'Aprender conceptos básicos'
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(topicoData)
        .expect('Content-Type', /json/)
        .expect(201);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.titulo).toBe('Nuevo Tópico');
      expect(body.data.duracion_estimada).toBe(60);
      expect(body.data.orden).toBe(1);
      expect(body.data.activo).toBe(true);

      // Verificar en BD
      const topicoEnBD = await prisma.topicoPlantilla.findFirst({
        where: { titulo: 'Nuevo Tópico' }
      });

      expect(topicoEnBD).toBeDefined();
      expect(topicoEnBD?.id_unidad_plantilla).toBe(unidadPlantillaId);
    });

    it('debe crear tópico con orden automático incremental', async () => {
      // Crear primer tópico
      await prisma.topicoPlantilla.create({
        data: {
          id_unidad_plantilla: unidadPlantillaId,
          titulo: 'Tópico 1',
          duracion_estimada: 60,
          orden: 1,
          version: 1,
          activo: true
        }
      });

      const topicoData = {
        titulo: 'Tópico 2',
        duracion_estimada: 45,
        version: 1
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(topicoData)
        .expect(201);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.orden).toBe(2);
    });

    it('debe fallar cuando falta el título', async () => {
      const topicoData = {
        descripcion: 'Solo descripción',
        duracion_estimada: 60
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(topicoData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Título y duración estimada son requeridos');
    });

    it('debe fallar cuando falta duracion_estimada', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción'
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(topicoData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Título y duración estimada son requeridos');
    });

    it('debe fallar con duracion_estimada negativa', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: -10,
        version: 1
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(topicoData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('La duración estimada debe ser mayor a 0');
    });

    it('debe fallar sin autenticación', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60,
        version: 1
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .send(topicoData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar con usuario sin permisos', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60,
        version: 1
      };

      const response = await request(app)
        .post(`/api/topicos-plantilla/unidad/${unidadPlantillaId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(topicoData)
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('No tiene permisos para realizar esta acción');
    });
  });

  describe('PUT /api/topicos-plantilla/:id', () => {
    let topicoId: number;

    beforeEach(async () => {
      const topico = await prisma.topicoPlantilla.create({
        data: {
          id_unidad_plantilla: unidadPlantillaId,
          titulo: 'Tópico Original',
          duracion_estimada: 60,
          orden: 1,
          version: 1,
          activo: true
        }
      });
      topicoId = topico.id;
    });

    it('debe actualizar un tópico plantilla', async () => {
      const updateData = {
        titulo: 'Tópico Actualizado',
        duracion_estimada: 90,
        descripcion: 'Nueva descripción'
      };

      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.titulo).toBe('Tópico Actualizado');
      expect(body.data.duracion_estimada).toBe(90);
      expect(body.data.descripcion).toBe('Nueva descripción');

      // Verificar en BD
      const topicoActualizado = await prisma.topicoPlantilla.findUnique({
        where: { id: topicoId }
      });

      expect(topicoActualizado?.titulo).toBe('Tópico Actualizado');
    });

    it('debe actualizar solo el título', async () => {
      const updateData = {
        titulo: 'Solo título actualizado'
      };

      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.titulo).toBe('Solo título actualizado');
      expect(body.data.duracion_estimada).toBe(60);
    });

    it('debe actualizar el estado publicado', async () => {
      const updateData = {
        publicado: true
      };

      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.publicado).toBe(true);
    });

    it('debe fallar con id inválido', async () => {
      const updateData = {
        titulo: 'Nuevo título'
      };

      const response = await request(app)
        .put('/api/topicos-plantilla/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('ID de tópico inválido');
    });

    it('debe fallar si el tópico no existe', async () => {
      const updateData = {
        titulo: 'Nuevo título'
      };

      const response = await request(app)
        .put('/api/topicos-plantilla/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Tópico no encontrado');
    });

    it('debe fallar con body vacío', async () => {
      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('No hay datos para actualizar');
    });

    it('debe fallar sin autenticación', async () => {
      const updateData = {
        titulo: 'Nuevo título'
      };

      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar con usuario sin permisos', async () => {
      const updateData = {
        titulo: 'Nuevo título'
      };

      const response = await request(app)
        .put(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('No tiene permisos para realizar esta acción');
    });
  });

  describe('DELETE /api/topicos-plantilla/:id', () => {
    let topicoId: number;

    beforeEach(async () => {
      const topico = await prisma.topicoPlantilla.create({
        data: {
          id_unidad_plantilla: unidadPlantillaId,
          titulo: 'Tópico para eliminar',
          duracion_estimada: 60,
          orden: 1,
          version: 1,
          activo: true
        }
      });
      topicoId = topico.id;
    });

    it('debe eliminar un tópico plantilla (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.activo).toBe(false);

      // Verificar en BD que es soft delete
      const topicoEliminado = await prisma.topicoPlantilla.findUnique({
        where: { id: topicoId }
      });

      expect(topicoEliminado).toBeDefined();
      expect(topicoEliminado?.activo).toBe(false);
    });

    it('debe fallar con id inválido', async () => {
      const response = await request(app)
        .delete('/api/topicos-plantilla/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('ID de tópico inválido');
    });

    it('debe fallar si el tópico no existe', async () => {
      const response = await request(app)
        .delete('/api/topicos-plantilla/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Tópico no encontrado');
    });

    it('debe fallar sin autenticación', async () => {
      const response = await request(app)
        .delete(`/api/topicos-plantilla/${topicoId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar con usuario sin permisos', async () => {
      const response = await request(app)
        .delete(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('No tiene permisos para realizar esta acción');
    });

    it('no debe eliminar permanentemente el registro', async () => {
      await request(app)
        .delete(`/api/topicos-plantilla/${topicoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verificar que el registro sigue existiendo
      const count = await prisma.topicoPlantilla.count({
        where: { id: topicoId }
      });

      expect(count).toBe(1);
    });
  });
});