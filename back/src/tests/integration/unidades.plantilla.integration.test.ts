import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import unidadesPlantillaRoutes from '../../routes/unidades.plantilla.routes';
import { ApiResponse } from '../../utils/apiResponse';
import { createAdminUserAndToken, createAcademicoUserAndToken } from '../helpers/auth.helper';

const app = express();
app.use(express.json());
app.use('/api/unidades-plantilla', unidadesPlantillaRoutes);

describe('UnidadPlantilla API - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.inscripcion.deleteMany({});
    await prisma.contenido.deleteMany({});
    await prisma.topico.deleteMany({});
    await prisma.unidad.deleteMany({});
    await prisma.topicoPlantilla.deleteMany({});
    await prisma.unidadPlantilla.deleteMany({});
    
    await prisma.edicion.deleteMany({});
    await prisma.curso.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.cargo.deleteMany({});
  });

  // GET UNIDADES POR CURSO
  describe('GET /api/unidades-plantilla/curso/:id_curso', () => {
    it('UP11: listar unidades de un curso existente', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Test', codigo_curso: 'CURSO1', descripcion: 'Demo' } });
      const unidad = await prisma.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Intro', orden: 1, version: 1, activo: true } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades-plantilla/curso/${curso.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(1);
      expect(body.data[0].titulo).toBe('Intro');
    });

    it('UP12: curso sin unidades', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso vacío', codigo_curso: 'CURSO2', descripcion: 'Demo' } });

      const res = await request(app)
        .get(`/api/unidades-plantilla/curso/${curso.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    });
  });

  // GET UNIDAD POR ID
  describe('GET /api/unidades-plantilla/:id', () => {
    it('UP1: obtener unidad existente', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C1', descripcion: 'Demo' } });
      const unidad = await prisma.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Intro', orden: 1, version: 1, activo: true } });

      const res = await request(app)
        .get(`/api/unidades-plantilla/${unidad.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(unidad.id);
      expect(body.data.titulo).toBe('Intro');
    });

    it('UP8/UP10: unidad inexistente', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .get(`/api/unidades-plantilla/9999`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Unidad plantilla no encontrada/);
    });
  });

  // POST CREAR UNIDAD
  describe('POST /api/unidades-plantilla', () => {
    it('UP1: creación exitosa', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Crear', codigo_curso: 'C2', descripcion: 'Demo' } });
      const newUnidad = { id_curso: curso.id, titulo: 'Nueva Unidad', orden: 1 };

      const res = await request(app)
        .post('/api/unidades-plantilla')
        .send(newUnidad)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(201);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.titulo).toBe('Nueva Unidad');
    });

    it('UP2: faltan título', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .post('/api/unidades-plantilla')
        .send({ id_curso: 1, titulo: '', orden: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/El título es obligatorio/);
    });

    it('UP3: faltan id_curso', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .post('/api/unidades-plantilla')
        .set('Authorization', `Bearer ${token}`)
        .send({ titulo: 'Unidad', orden: 1 })
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/El curso es obligatorio/);
    });

    it('UP4: faltan orden', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C3', descripcion: 'Demo' } });
      const res = await request(app)
        .post('/api/unidades-plantilla')
        .send({ id_curso: curso.id, titulo: 'Unidad', orden: null })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/El orden es obligatorio/);
    });

    it('UP5: unidad duplicada', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Duplicado', codigo_curso: 'C4', descripcion: 'Demo' } });
      await prisma.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Duplicada', orden: 1, version: 1, activo: true } });

      const res = await request(app)
        .post('/api/unidades-plantilla')
        .send({ id_curso: curso.id, titulo: 'Duplicada', orden: 2 })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(409);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Ya existe una unidad con ese nombre/);
    });

    it('UP6: error interno', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .post('/api/unidades-plantilla')
        .send({ id_curso: 'invalid', titulo: 'Unidad', orden: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(500);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
    });
  });

  // PUT UPDATE UNIDAD
  describe('PUT /api/unidades-plantilla/:id', () => {
    it('UP7: actualización exitosa', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Update', codigo_curso: 'C5', descripcion: 'Demo' } });
      const unidad = await prisma.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Vieja', orden: 1, version: 1, activo: true } });

      const res = await request(app)
        .put(`/api/unidades-plantilla/${unidad.id}`)
        .send({ titulo: 'Nueva' })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.titulo).toBe('Nueva');
    });

    it('UP8: unidad inexistente', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .put('/api/unidades-plantilla/9999')
        .send({ titulo: 'Nuevo' })
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Unidad plantilla no encontrada/);
    });
  });

  // DELETE UNIDAD
  describe('DELETE /api/unidades-plantilla/:id', () => {
    it('UP9: eliminación exitosa', async () => {
      const { token } = await createAcademicoUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Delete', codigo_curso: 'C6', descripcion: 'Demo' } });
      const unidad = await prisma.unidadPlantilla.create({ data: { id_curso: curso.id, titulo: 'Eliminar', orden: 1, version: 1, activo: true } });

      const res = await request(app)
        .delete(`/api/unidades-plantilla/${unidad.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.message).toMatch(/eliminada correctamente/);
    });

    it('UP10: unidad inexistente', async () => {
      const { token } = await createAcademicoUserAndToken();
      const res = await request(app)
        .delete('/api/unidades-plantilla/9999')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Unidad plantilla no encontrada/);
    });
  });
});
