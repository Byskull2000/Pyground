// back/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import * as userRepo from '../repositories/usuarios.repository';
import { RegisterData } from '../types/auth.types';

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

  // Verificar si el usuario está activo
  if (!usuario.activo) {
    throw new Error('Account inactive');
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
