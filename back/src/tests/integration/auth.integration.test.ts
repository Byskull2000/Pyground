import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';
import bcrypt from 'bcrypt';

// Crear app de prueba
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.usuario.deleteMany({});
  });

  describe('POST /api/auth/login', () => {
 /*   it('debe hacer login exitoso y retornar JWT (LO1)', async () => {
      // Crear usuario en BD
     const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true
        }
      });

      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('token');
      expect(body.data).toHaveProperty('user');
      expect(body.data.user.email).toBe('test@example.com');
      expect(body.data.user).not.toHaveProperty('password');
      expect(body.data.user).not.toHaveProperty('password_hash');
    });
*/
    it('debe fallar con contraseña incorrecta (LO2)', async () => {
      const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true
        }
      });

      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Credenciales inválidas');
    });

    it('debe fallar con usuario inexistente (LO3)', async () => {
      const loginData = {
        email: 'noexiste@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(404);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Usuario no encontrado');
    });

    it('debe fallar cuando falta email (LO4)', async () => {
      const loginData = {
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Email y password son requeridos');
    });

    it('debe fallar con contraseña vacía (LO5)', async () => {
      const loginData = {
        email: 'test@example.com',
        password: ''
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Email y password son requeridos');
    });

    it('debe fallar cuando solo falta email (LO6 - solo email)', async () => {
      const loginData = {
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Email y password son requeridos');
    });

    it('debe fallar cuando solo falta password (LO6 - solo password)', async () => {
      const loginData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Email y password son requeridos');
    });

    it('debe fallar con cuenta inactiva', async () => {
      const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'inactive@example.com',
          nombre: 'Inactive',
          apellido: 'User',
          password_hash: passwordHash,
          activo: false
        }
      });

      const loginData = {
        email: 'inactive@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Cuenta inactiva. Contacte al administrador');
    });
  });

});