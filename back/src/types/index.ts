// src/types/index.ts
import { Usuario } from '../../generated/prisma';

// Tipo simplificado del usuario para middlewares
export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  provider?: string | null;
}

// Alias para IUser usado en passport.d.ts
export type IUser = AuthUser;

// Payload del JWT
export interface JWTPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  iat?: number;
  exp?: number;
}

// Perfil de Google OAuth
export interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
}

// Respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Partial<Usuario>;
  token?: string;
}

// Datos de usuario para respuestas (sin información sensible)
export interface UserResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  avatar_url?: string | null;
  bio?: string | null;
  provider?: string | null;
  fecha_registro: Date;
  ultimo_acceso?: Date | null;
}