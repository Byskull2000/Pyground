export interface UsuarioCreate {
  email: string;
  password_hash?: string;
  nombre: string;
  apellido: string;
  activo?: boolean;
  avatar_url?: string;
  bio?: string;
  google_id?: string;
  provider?: string;
}

export interface UsuarioUpdate {
  email?: string;
  password_hash?: string;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  avatar_url?: string;
  bio?: string;
  google_id?: string;
  provider?: string;
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
