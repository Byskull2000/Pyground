import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import unidadesRoutes from '../../routes/unidades.routes';
import { ApiResponse } from '../../utils/apiResponse';
import { createAdminUserAndToken, createAcademicoUserAndToken } from '../helpers/auth.helper';

const app = express();
app.use(express.json());
app.use('/api/unidades', unidadesRoutes);

describe('Unidad API - Integration Tests', () => {
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
  });

  // GET UNIDADES POR EDICION
  describe('GET /api/unidades/edicion/:id_edicion', () => {
    it('U17: listar unidades de una edición existente', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso 1', codigo_curso: 'C1', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion 1', activo: true, fecha_apertura: new Date("2025-01-10"), creado_por: 'Admin', id_curso: curso.id } });
      const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 1', orden: 1, activo: true } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades/edicion/${edicion.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(1);
      expect(body.data[0].titulo).toBe('Unidad 1');
    });

    it('U18: edición sin unidades', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso vacío', codigo_curso: 'CV', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion vacía', activo: true, fecha_apertura: new Date("2025-01-11"), creado_por: 'Admin', id_curso: curso.id } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades/edicion/${edicion.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    });

    it('U19: edición inexistente', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades/edicion/9999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Edición no encontrada/);
    });
  });

  // GET UNIDAD POR ID
  describe('GET /api/unidades/:id', () => {
    it('U20: consulta exitosa', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso 2', codigo_curso: 'C2', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-12"), creado_por: 'Admin', id_curso: curso.id } });
      const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 1', orden: 1, activo: true } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades/${unidad.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(unidad.id);
      expect(body.data.titulo).toBe('Unidad 1');
    });

    it('U21: unidad inexistente', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .get(`/api/unidades/9999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Unidad no encontrada/);
    });
  });

  // POST CREAR UNIDAD
  describe('POST /api/unidades', () => {
    it('U1: creación exitosa', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Crear', codigo_curso: 'CC', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Crear', activo: true, fecha_apertura: new Date("2025-01-13"), creado_por: 'Admin', id_curso: curso.id } });
      const { token } = await createAcademicoUserAndToken();
      const newUnidad = { id_edicion: edicion.id, titulo: 'Nueva Unidad', orden: 1 };

      const res = await request(app)
        .post(`/api/unidades`)
        .send(newUnidad)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.titulo).toBe('Nueva Unidad');
    });

    it('U2: faltan título', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C3', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-14"), creado_por: 'Admin', id_curso: curso.id } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .post(`/api/unidades`)
        .send({ id_edicion: edicion.id, orden: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/El título es obligatorio/);
    });

    it('U3: faltan id_edicion', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .post(`/api/unidades`)
        .send({ titulo: 'Unidad', orden: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/La edición es obligatoria/);
    });

    it('U4: faltan orden', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso', codigo_curso: 'C4', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion', activo: true, fecha_apertura: new Date("2025-01-15"), creado_por: 'Admin', id_curso: curso.id } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .post(`/api/unidades`)
        .send({ id_edicion: edicion.id, titulo: 'Unidad' })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/El orden es obligatorio/);
    });

    it('U5: unidad duplicada', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Dup', codigo_curso: 'CD', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Duplicada', activo: true, fecha_apertura: new Date("2025-01-16"), creado_por: 'Admin', id_curso: curso.id } });
      await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Duplicada', orden: 1, activo: true } });
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .post(`/api/unidades`)
        .send({ id_edicion: edicion.id, titulo: 'Duplicada', orden: 2 })
        .set('Authorization', `Bearer ${token}`)
        .expect(409);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Ya existe una unidad con este titulo/);
    });

    it('U6: error interno', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .post(`/api/unidades`)
        .send({ id_edicion: 'invalid', titulo: 'Unidad', orden: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(500);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
    });
  });

  // PUT UPDATE UNIDAD
describe('PUT /api/unidades/:id', () => {
  it('U7: actualización exitosa', async () => {
    const curso = await prisma.curso.create({ data: { nombre: 'Curso Update', codigo_curso: 'CU', descripcion: 'Demo' } });
    const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Update', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
    const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Vieja', orden: 1, activo: true } });
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/${unidad.id}`)
      .send({ titulo: 'Nueva' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(true);
    expect(body.data.titulo).toBe('Nueva');
  });

  it('U8: unidad inexistente', async () => {
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/9999`)
      .send({ titulo: 'Nuevo' })
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unidad no encontrada/);
  });
});

// DELETE UNIDAD
describe('DELETE /api/unidades/:id', () => {
  it('U9: eliminación exitosa', async () => {
    const curso = await prisma.curso.create({ data: { nombre: 'Curso Delete', codigo_curso: 'CD', descripcion: 'Demo' } });
    const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Delete', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
    const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Eliminar', orden: 1, activo: true } });
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .delete(`/api/unidades/${unidad.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(true);
    expect(body.data.message).toMatch(/Unidad eliminada correctamente/);
  });

  it('U10: unidad inexistente', async () => {
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .delete(`/api/unidades/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unidad no encontrada/);
  });
});

// PUT RESTAURAR UNIDAD
describe('PUT /api/unidades/restaurar/:id', () => {
  it('U11: restauración exitosa', async () => {
    const curso = await prisma.curso.create({ data: { nombre: 'Curso Restore', codigo_curso: 'CR', descripcion: 'Demo' } });
    const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Restore', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
    const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: false } });
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/restaurar/${unidad.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(true);
    expect(body.data.message).toMatch(/Unidad restaurada correctamente/);
  });

  it('U12: unidad inexistente', async () => {
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/restaurar/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unidad no encontrada/);
  });
});

// PUT PUBLICAR UNIDAD
describe('PUT /api/unidades/publicar/:id', () => {
  it('U13: publicación exitosa', async () => {
    const curso = await prisma.curso.create({ data: { nombre: 'Curso Public', codigo_curso: 'CP', descripcion: 'Demo' } });
    const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Public', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
    const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: false } });
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/publicar/${unidad.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(true);
    expect(body.data.message).toMatch(/Unidad publicada correctamente/);
  });

  it('U14: unidad inexistente', async () => {
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/publicar/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unidad no encontrada/);
  });
});

// PUT DESACTIVAR UNIDAD
describe('PUT /api/unidades/desactivar/:id', () => {
  it('U15: desactivación exitosa', async () => {
    const curso = await prisma.curso.create({ data: { nombre: 'Curso Deactivate', codigo_curso: 'CD', descripcion: 'Demo' } });
    const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Deactivate', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
    const unidad = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad', orden: 1, activo: true } });
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/desactivar/${unidad.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(true);
    expect(body.data.message).toMatch(/Unidad archivada correctamente/);
  });

  it('U16: unidad inexistente', async () => {
    const { token } = await createAcademicoUserAndToken();

    const res = await request(app)
      .put(`/api/unidades/desactivar/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const body: ApiResponse<any> = res.body;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unidad no encontrada/);
  });
});

  // PUT REORDENAR UNIDADES
  describe('PUT /api/unidades/reordenar', () => {
    it('U22: reordenamiento exitoso', async () => {
      const curso = await prisma.curso.create({ data: { nombre: 'Curso Reorder', codigo_curso: 'CR', descripcion: 'Demo' } });
      const edicion = await prisma.edicion.create({ data: { nombre_edicion: 'Edicion Reorder', activo: true, fecha_apertura: new Date(), creado_por: 'Admin', id_curso: curso.id } });
      const unidad1 = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 1', orden: 1, activo: true } });
      const unidad2 = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 2', orden: 2, activo: true } });
      const unidad3 = await prisma.unidad.create({ data: { id_edicion: edicion.id, titulo: 'Unidad 3', orden: 3, activo: true } });
      const { token } = await createAcademicoUserAndToken();

      const reordered = [
        { id: unidad2.id, orden: 1 },
        { id: unidad1.id, orden: 2 },
        { id: unidad3.id, orden: 3 },
      ];

      const res = await request(app)
        .put(`/api/unidades/reordenar`)
        .send(reordered)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.message).toMatch(/Unidades reordenadas correctamente/);

      // Comprobamos en BD que los cambios se aplicaron
      const unidadesDb = await prisma.unidad.findMany({ where: { id_edicion: edicion.id }, orderBy: { orden: 'asc' } });
      expect(unidadesDb[0].id).toBe(unidad2.id);
      expect(unidadesDb[1].id).toBe(unidad1.id);
      expect(unidadesDb[2].id).toBe(unidad3.id);
    });

    it('U23: error por array vacío', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .put(`/api/unidades/reordenar`)
        .send([])
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Debe enviar al menos una unidad para reordenar/);
    });

    it('U24: error por unidad sin id o sin orden', async () => {
      const { token } = await createAcademicoUserAndToken();

      const invalidUnits = [
        { id: 1 } as any,  // falta orden
        { orden: 2 } as any // falta id
      ];

      const res = await request(app)
        .put(`/api/unidades/reordenar`)
        .send(invalidUnits)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Cada unidad debe tener id y orden válidos/);
    });

    it('U25: error por unidad inexistente en BD', async () => {
      const { token } = await createAcademicoUserAndToken();

      const invalidUnits = [
        { id: 9999, orden: 1 },
        { id: 10000, orden: 2 },
      ];

      const res = await request(app)
        .put(`/api/unidades/reordenar`)
        .send(invalidUnits)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Una o más unidades no existen/);
    });
  });


});
