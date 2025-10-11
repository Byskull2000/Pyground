// back/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import * as userRepo from '../repositories/usuarios.repository';
import { RegisterData } from '../types/auth.types';
import * as emailService from './email.service';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = '7d';

// Generar JWT
const generateToken = (userId: number, email: string, nombre: string, apellido: string): string => {
  return jwt.sign(
    { 
      id: userId, 
      email,
      nombre,
      apellido
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};


// Login de usuario
export const loginUser = async (email: string, password: string) => {
  // Buscar usuario por email

  const usuario = await userRepo.getUsuarioByEmail(email);
  
  if (!usuario) {
    throw new Error('User not found');
  }

  // Verificar si es usuario local (no OAuth)
  if (!usuario.password_hash) {
    throw new Error('Invalid credentials');
  }

  // Comparar contraseñas
  const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Verificar si el email está verificado
  if (!usuario.email_verificado) {
    throw new Error('Email not verified');
  }

  // Verificar si el usuario está activo
  if (!usuario.activo) {
    throw new Error('Account inactive');
  }

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Actualizar último acceso
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimo_acceso: new Date() }
  });

  // Generar token
  const token = generateToken(usuario.id, usuario.email, usuario.nombre, usuario.apellido);

  // Eliminar password_hash de la respuesta
  const { password_hash, ...userWithoutPassword } = usuario;

  return {
    message: 'Login exitoso',
    token,
    user: userWithoutPassword
  };
};
//cora
export const verificarEmail = async (email: string, codigo: string) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    throw new Error('User not found');
  }

  if (usuario.email_verificado) {
    throw new Error('Email already verified');
  }

  if (!usuario.codigo_verificacion || !usuario.codigo_expiracion) {
    throw new Error('No verification code found');
  }

  // Verificar si el código expiró
  if (new Date() > usuario.codigo_expiracion) {
    throw new Error('Verification code expired');
  }

  // Verificar si el código coincide
  if (usuario.codigo_verificacion !== codigo) {
    throw new Error('Invalid verification code');
  }

  // Activar usuario y marcar email como verificado
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      email_verificado: true,
      activo: true,
      codigo_verificacion: null,
      codigo_expiracion: null
    }
  });

  // Enviar email de bienvenida
  try {
    await emailService.enviarEmailBienvenida(usuario.email, usuario.nombre);
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
  }

  return { message: 'Email verificado exitosamente' };
};

// 🆕🆕🆕 AGREGAR ESTA FUNCIÓN COMPLETA
export const reenviarCodigoVerificacion = async (email: string) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    throw new Error('User not found');
  }

  if (usuario.email_verificado) {
    throw new Error('Email already verified');
  }

  // Generar nuevo código
  const codigo_verificacion = emailService.generarCodigoVerificacion();
  const codigo_expiracion = emailService.calcularExpiracion();

  // Actualizar código en BD
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      codigo_verificacion,
      codigo_expiracion
    }
  });

  // Enviar email
  await emailService.enviarEmailVerificacion(
    usuario.email,
    usuario.nombre,
    codigo_verificacion
  );

  return { message: 'Código de verificación reenviado' };
};
// Cambiar contraseña
export const changePassword = async (
  userId: number, 
  currentPassword: string, 
  newPassword: string
) => {
  // Buscar usuario
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password_hash: true,
      provider: true
    }
  });

  if (!usuario) {
    throw new Error('User not found');
  }

  // Verificar que sea usuario local
  if (usuario.provider !== 'local' || !usuario.password_hash) {
    throw new Error('Password change not available for OAuth users');
  }

  // Verificar contraseña actual
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword, 
    usuario.password_hash
  );

  if (!isCurrentPasswordValid) {
    throw new Error('Invalid current password');
  }

  // Hashear nueva contraseña
  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Actualizar contraseña
  await prisma.usuario.update({
    where: { id: userId },
    data: { password_hash: newPasswordHash }
  });

  return { message: 'Password changed successfully' };
};

// Verificar token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export function validateUser(arg0: number) {
    throw new Error('Function not implemented.');
}
