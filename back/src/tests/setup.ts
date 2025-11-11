import dotenv from 'dotenv';
import { PrismaClient } from '../../generated/prisma';
import { JWT_SECRET } from './helpers/auth.helper';

// Configurar variables de entorno para tests
process.env.JWT_SECRET = JWT_SECRET;
dotenv.config({ path: '.env.test' });

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Conectar a la base de datos de test
  await prisma.$connect();
});

afterAll(async () => {
  // Limpiar y desconectar
  await prisma.$disconnect();
});

afterEach(async () => {
  // Limpiar datos después de cada test en orden para evitar violaciones de FK
  await prisma.visto.deleteMany();
  await prisma.comentario.deleteMany();
  await prisma.inscripcion.deleteMany();
  await prisma.contenido.deleteMany({});
  await prisma.topico.deleteMany();
  await prisma.unidad.deleteMany();
  await prisma.edicion.deleteMany();
  await prisma.topicoPlantilla.deleteMany();
  await prisma.unidadPlantilla.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.usuario.deleteMany();
});

// Helpers para tests
export const createMockRequest = (body = {}, params = {}, query = {}) => {
  return {
    body,
    params,
    query,
    headers: {},
    user: null,
  } as any;
};

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};