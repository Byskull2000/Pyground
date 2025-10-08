// back/src/types/auth.types.ts

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    avatar_url: string | null;
    bio: string | null;
    provider: string | null;
    fecha_registro: Date;
  };
}