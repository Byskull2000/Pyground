export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  avatar_url?: string;
  provider?: string;
  bio?: string;
  activo?: boolean;
  rol?: 'ADMIN' | 'USUARIO' | 'ACADEMICO';
  fecha_registro?: Date;
  ultimo_acceso?: Date;
}