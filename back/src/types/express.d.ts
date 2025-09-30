// src/types/express.d.ts
import { Usuario } from '../../generated';

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  provider?: string | null;
}

declare global {
  namespace Express {
    interface User extends Usuario {}
    
    interface Request {
      user?: Usuario | AuthUser;
    }
  }
}

export {};