import request from 'supertest';
import express from 'express';
import prisma from '../../config/prisma';
import topicosRoutes from '../../routes/topicos.routes';
import { ApiResponse } from '../../utils/apiResponse';
import { createAcademicoUserAndToken } from '../helpers/auth.helper';

const app = express();
app.use(express.json());
app.use('/api/topicos', topicosRoutes);

describe('Tópicos API - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.topico.deleteMany({});
    await prisma.unidad.deleteMany({});
    await prisma.edicion.deleteMany({});
    await prisma.curso.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.cargo.deleteMany({});
  });

  // PUT REORDENAR TOPICOS
  describe('PUT /api/topicos/reordenar', () => {
    it('T1: reordenamiento exitoso', async () => {
      const curso = await prisma.curso.create({
        data: {
          nombre: 'Curso Reorder',
          codigo_curso: 'CR',
          descripcion: 'Demo',
          activo: true
        }
      });

      const edicion = await prisma.edicion.create({
        data: {
          curso: { connect: { id: curso.id } },
          nombre_edicion: 'Edicion Reorder',
          descripcion: 'Demo',
          fecha_apertura: new Date(),
          activo: true,
          creado_por: 'Admin'
        }
      });

      const unidad = await prisma.unidad.create({
        data: {
          edicion: { connect: { id: edicion.id } },
          titulo: 'Unidad 1',
          descripcion: 'Unidad demo',
          orden: 1,
          activo: true
        }
      });

      const topico1 = await prisma.topico.create({
        data: {
          unidad: { connect: { id: unidad.id } },
          titulo: 'Tópico 1',
          descripcion: 'Descripción 1',
          duracion_estimada: 60,
          orden: 1,
          publicado: false,
          activo: true
        }
      });

      const topico2 = await prisma.topico.create({
        data: {
          unidad: { connect: { id: unidad.id } },
          titulo: 'Tópico 2',
          descripcion: 'Descripción 2',
          duracion_estimada: 60,
          orden: 2,
          publicado: false,
          activo: true
        }
      });

      const topico3 = await prisma.topico.create({
        data: {
          unidad: { connect: { id: unidad.id } },
          titulo: 'Tópico 3',
          descripcion: 'Descripción 3',
          duracion_estimada: 60,
          orden: 3,
          publicado: false,
          activo: true
        }
      });

      const { token } = await createAcademicoUserAndToken();

      const reordered = [
        { id: topico2.id, orden: 1 },
        { id: topico1.id, orden: 2 },
        { id: topico3.id, orden: 3 },
      ];

      const res = await request(app)
        .put('/api/topicos/reordenar')
        .send(reordered)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(true);
      expect(body.data.message).toMatch(/Topicos reordenados correctamente/);

      const topicosDb = await prisma.topico.findMany({ where: { id_unidad: unidad.id }, orderBy: { orden: 'asc' } });
      expect(topicosDb[0].id).toBe(topico2.id);
      expect(topicosDb[1].id).toBe(topico1.id);
      expect(topicosDb[2].id).toBe(topico3.id);
    });

    it('T2: error por array vacío', async () => {
      const { token } = await createAcademicoUserAndToken();

      const res = await request(app)
        .put('/api/topicos/reordenar')
        .send([])
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Debe enviar al menos un topico para reordenar/);
    });

    it('T3: error por tópico sin id o sin orden', async () => {
      const { token } = await createAcademicoUserAndToken();

      const invalidTopicos = [
        { id: 1 } as any,  // falta orden
        { orden: 2 } as any // falta id
      ];

      const res = await request(app)
        .put('/api/topicos/reordenar')
        .send(invalidTopicos)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Cada topico debe tener id y orden válidos/);
    });

    it('T4: error por tópico inexistente en BD', async () => {
      const { token } = await createAcademicoUserAndToken();

      const invalidTopicos = [
        { id: 9999, orden: 1 },
        { id: 10000, orden: 2 },
      ];

      const res = await request(app)
        .put('/api/topicos/reordenar')
        .send(invalidTopicos)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      const body: ApiResponse<any> = res.body;
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Uno o más topicos no existen/);
    });
  });
});
