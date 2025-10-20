import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import inscripcionesRoutes from '../../routes/inscripciones.routes';
import { ApiResponse } from '../../utils/apiResponse';
import { createAdminUserAndToken, createUserAndToken } from '../helpers/auth.helper';

const app = express();
app.use(express.json());
app.use('/api/inscripciones', inscripcionesRoutes);

describe('Inscripciones API - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.inscripcion.deleteMany({});
    await prisma.topico.deleteMany({});
    await prisma.unidad.deleteMany({});
    await prisma.topicoPlantilla.deleteMany({});
    await prisma.unidadPlantilla.deleteMany({});
    
    await prisma.edicion.deleteMany({});
    await prisma.curso.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.cargo.deleteMany({});
  });



  // CREAR INSCRIPCIÓN
  describe('POST /api/inscripciones', () => {
    it('IS5: creación exitosa de una inscripción', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test',  email: 'test@correo.com' } });
      const cargo = await prisma.cargo.create({ data: { nombre: 'Participante' } });
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Prueba', codigo_curso: 'PRUEBA', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición 2025', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10')} });

      const newInscripcion = { usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id };

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newInscripcion)
        .expect('Content-Type', /json/)
        .expect(201);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.usuario_id).toBe(usuario.id);
      expect(body.error).toBeNull();
    });

    it('IS6: faltan campos obligatorios', async () => {
      const { token: adminToken } = await createAdminUserAndToken();

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ edicion_id: 1, cargo_id: 1 })
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/El usuario es obligatorio/);
    });

    it('IS7: usuario no encontrado', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Prueba', codigo_curso: 'PRUEBA', descripcion: 'Demo' } });
      const cargo = await prisma.cargo.create({ data: { nombre: 'Participante' } });
      const edicion = await prisma.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición 2025', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: 9999, edicion_id: edicion.id, cargo_id: cargo.id })
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Usuario no encontrado|inactivo/);
    });

    it('IS8: edición no encontrada o inactiva', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
      const cargo = await prisma.cargo.create({ data: { nombre: 'Participante' } });

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: usuario.id, edicion_id: 9999, cargo_id: cargo.id })
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Edición no encontrada|inactiva/);
    });

    it('IS9: edición no publicada', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
      const cargo = await prisma.cargo.create({ data: { nombre: 'Estudiante' } });
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: false, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id })
        .expect('Content-Type', /json/)
        .expect(409);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/no esta abierta a inscripciones/);
    });

    it('IS10: cargo no encontrado', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: 9999 })
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Cargo no encontrado/);
    });

    it('IS11: usuario ya inscrito en la edición', async () => {
      const { token: adminToken } = await createAdminUserAndToken();
      const usuario = await prisma.usuario.create({ data: { nombre: 'Usuario', apellido: 'Test', email: 'test@correo.com' } });
      const cargo = await prisma.cargo.create({ data: { nombre: 'Participante' } });
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'CURSO', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { id_curso: curso.id, nombre_edicion: 'Edición', activo: true, estado_publicado: true, creado_por: 'admin@correo.com', fecha_apertura: new Date('2025-01-10') } });

      await prisma.inscripcion.create({ data: { usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id } });

      const response = await request(app)
        .post('/api/inscripciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: usuario.id, edicion_id: edicion.id, cargo_id: cargo.id })
        .expect('Content-Type', /json/)
        .expect(409);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/ya está inscrito/);
    });

  });
});
