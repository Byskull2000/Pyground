import dotenv from 'dotenv';
import { PrismaClient } from '../../generated/prisma';

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
  // Limpiar datos después de cada test - Ajustado a tu schema
  await prisma.inscripcion.deleteMany({});
  await prisma.usuario.deleteMany({});
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