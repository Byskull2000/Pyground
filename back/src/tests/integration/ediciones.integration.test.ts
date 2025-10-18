import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import edicionesRoutes from '../../routes/ediciones.routes';
import { ApiResponse } from '../../utils/apiResponse';

const app = express();
app.use(express.json());
app.use('/api/ediciones', edicionesRoutes);

describe('Ediciones API - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.topico.deleteMany({});
    await prisma.topicoPlantilla.deleteMany({});
    await prisma.inscripcion.deleteMany({});
    await prisma.unidad.deleteMany({});
    await prisma.unidadPlantilla.deleteMany({});
    await prisma.edicion.deleteMany({});
    await prisma.curso.deleteMany({});
  });

  describe('POST /api/ediciones', () => {
    it('ED1: creación exitosa de una edición', async () => {
      const curso = await prisma.curso.create({
        data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo', estado_publicado: true }
      });

      await prisma.edicion.deleteMany({});

      const newEdicion = {
        id_curso: curso.id,
        nombre_edicion: 'Edición Prueba 2025',
        descripcion: 'Primera edición del curso',
        fecha_apertura: new Date('2025-01-10'),
        fecha_cierre: new Date('2025-10-20'),
        creado_por: 'admin@correo.com'
      };

      const response = await request(app)
        .post('/api/ediciones')
        .send(newEdicion)
        .expect('Content-Type', /json/)
        .expect(201);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.nombre_edicion).toBe('Edición Prueba 2025');
      expect(body.error).toBeNull();
    });

    it('ED2: faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/ediciones')
        .send({
          fecha_apertura: '2025-02-10'
        })
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Faltan campos obligatorios|El nombre de la edición es obligatorio/);
    });

    it('ED3: curso inexistente', async () => {
      const response = await request(app)
        .post('/api/ediciones')
        .send({
          id_curso: 9999,
          nombre_edicion: 'Edición Prueba',
          fecha_apertura: '2025-01-10',
          fecha_cirre: '2025-10-10'
        })
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Curso no encontrado/);
    });

    it('ED4: fecha de apertura inválida', async () => {
      const curso = await prisma.curso.create({
        data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo', estado_publicado: true }
      });

      const response = await request(app)
        .post('/api/ediciones')
        .send({
          id_curso: curso.id,
          nombre_edicion: 'Edición con fecha inválida',
          fecha_apertura: 'fecha_invalida'
        })
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/La fecha de apertura es inválida/);
    });

    it('ED5: duplicado de edición dentro del mismo curso', async () => {
      const curso = await prisma.curso.create({
        data: { nombre: 'Curso Duplicado', codigo_curso: "DUPLICADO", descripcion: 'Test duplicado', estado_publicado:true }
      });

      await prisma.edicion.create({
        data: {
          id_curso: curso.id,
          nombre_edicion: 'Edicion 2025',
          fecha_apertura: new Date('2025-01-10'),
          fecha_cierre: new Date('2025-08-10'),
          creado_por: 'admin@correo.com'
        }
      });

      const response = await request(app)
        .post('/api/ediciones')
        .send({
          id_curso: curso.id,
          nombre_edicion: 'Edicion 2025',
          fecha_apertura: '2025-01-10',
          fecha_cierre: '2025-08-10',
          creado_por: 'admin@correo.com'
        })
        .expect('Content-Type', /json/)
        .expect(409);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/Ya existe una edición con ese nombre para este curso/);
    });

    it('ED6: fecha de cierre antes de apertura', async () => {
      const curso = await prisma.curso.create({
        data: { nombre: 'Curso Prueba', codigo_curso: "PRUEBA", descripcion: 'Demo' }
      });

      const response = await request(app)
        .post('/api/ediciones')
        .send({
          id_curso: curso.id,
          nombre_edicion: 'Edición temporal',
          fecha_apertura: new Date('2025-10-10'),
          fecha_cierre: new Date('2025-01-01'),
          creado_por: 'admin@correo.com'
        })
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toMatch(/La fecha de apertura no puede ser mayor a la fecha de cierre/);
    });

    it('ED11: creación de edición con unidades clonadas desde plantilla', async () => {
    const curso = await prisma.curso.create({
      data: {
        nombre: 'Curso',
        codigo_curso: 'CURSO',
        descripcion: 'Curso base con unidades plantilla',
        estado_publicado: true
      }
    });

    await prisma.unidadPlantilla.createMany({
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

    const response = await request(app)
      .post('/api/ediciones')
      .send(newEdicion)
      .expect('Content-Type', /json/)
      .expect(201);

    const body: ApiResponse<any> = response.body;
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
    expect(body.data.nombre_edicion).toBe('Edición 2025-I');
    expect(body.error).toBeNull();

    const unidadesClonadas = await prisma.unidad.findMany({
      where: { id_edicion: body.data.id }
    });

    expect(unidadesClonadas.length).toBe(3);
    expect(unidadesClonadas.map(u => u.titulo)).toEqual(
      expect.arrayContaining(['Unidad 1', 'Unidad 2', 'Unidad 3'])
    );

    if (body.data.mensaje_extra) {
      expect(body.data.mensaje_extra).toMatch(/\d+ unidades creadas desde la plantilla/);
    }
  });


  });
});
