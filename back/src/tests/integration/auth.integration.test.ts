import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import { ApiResponse } from '../../utils/apiResponse';
import prisma from '../../config/prisma';
import bcrypt from 'bcrypt';
import { MOCK_VERIFICATION_CODE } from '../../services/__mocks__/email.service';

// Mock del servicio de email
jest.mock('../../services/email.service');

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
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
   /* it('debe hacer login exitoso y retornar JWT (LO1)', async () => {
      // Crear usuario verificado en BD
      const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true,
          email_verificado: true
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
    it('debe fallar con email no verificado', async () => {
      // Crear usuario NO verificado en BD
      const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true,
          email_verificado: false
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
        .expect(403);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Por favor verifica tu email antes de iniciar sesión');
    });

    it('debe fallar con contraseña incorrecta (LO2)', async () => {
      const passwordHash = await bcrypt.hash('Password123', 10);
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true,
          email_verificado: true
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
      expect(body.error).toBe('Por favor verifica tu email antes de iniciar sesión');
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('debe verificar el email exitosamente', async () => {
      // Crear usuario con código de verificación
      const codigo = '123456';
      const expiracion = new Date(Date.now() + 3600000); // 1 hora en el futuro
      
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: await bcrypt.hash('Password123', 10),
          activo: true,
          email_verificado: false,
          codigo_verificacion: codigo,
          codigo_expiracion: expiracion
        }
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({
          email: 'test@example.com',
          codigo: codigo
        })
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Email verificado exitosamente');

      // Verificar que el usuario fue actualizado en BD
      const usuario = await prisma.usuario.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(usuario?.email_verificado).toBe(true);
      expect(usuario?.codigo_verificacion).toBeNull();
      expect(usuario?.codigo_expiracion).toBeNull();
    });

    it('debe fallar con código inválido', async () => {
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: await bcrypt.hash('Password123', 10),
          activo: true,
          email_verificado: false,
          codigo_verificacion: '123456',
          codigo_expiracion: new Date(Date.now() + 3600000)
        }
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({
          email: 'test@example.com',
          codigo: 'wrong-code'
        })
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Código de verificación inválido');
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    it('debe reenviar el código de verificación', async () => {
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: await bcrypt.hash('Password123', 10),
          activo: true,
          email_verificado: false
        }
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Código de verificación reenviado');

      // Verificar que se actualizó el código en BD
      const usuario = await prisma.usuario.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(usuario?.codigo_verificacion).toBeDefined();
      expect(usuario?.codigo_expiracion).toBeDefined();
    });

    it('debe fallar si el email ya está verificado', async () => {
      await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: await bcrypt.hash('Password123', 10),
          activo: true,
          email_verificado: true
        }
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.error).toBe('Email ya verificado');
    });
  });
/*
  describe('PUT /api/auth/change-password', () => {
    let token: string;
    let userId: number;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const passwordHash = await bcrypt.hash('OldPassword123', 10);
      const user = await prisma.usuario.create({
        data: {
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password_hash: passwordHash,
          activo: true,
          email_verificado: true
        }
      });
      userId = user.id;

      // Login para obtener token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'OldPassword123'
        });

      token = loginResponse.body.data.token;
    });

    it('debe cambiar la contraseña exitosamente', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(200);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('message', 'Contraseña actualizada correctamente');

      // Verificar que la nueva contraseña funciona
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword456'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('debe fallar si no está autenticado', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .send(passwordData)
        .expect(401);

      // El middleware responde con formato { error: '...' }
      expect(response.body).toHaveProperty('error');
    });

    it('debe fallar con contraseña actual incorrecta', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(401);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Contraseña actual incorrecta');
    });

    it('debe fallar con nueva contraseña muy corta', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: '123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('La nueva contraseña debe tener al menos 6 caracteres');
    });

    it('debe fallar cuando falta contraseña actual', async () => {
      const passwordData = {
        newPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Contraseña actual y nueva contraseña son requeridas');
    });

    it('debe fallar cuando falta nueva contraseña', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(400);

      const body: ApiResponse<any> = response.body;

      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.error).toBe('Contraseña actual y nueva contraseña son requeridas');
    });

    it('debe fallar con token inválido', async () => {
      const passwordData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', 'Bearer invalid-token')
        .send(passwordData)
        .expect(401);

      // El middleware responde con formato { error: '...' }
      expect(response.body).toHaveProperty('error');
    });
  });*/
});