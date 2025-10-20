// back/src/types/express.d.ts
// Extensión de tipos para Express Request
import { RolesEnum } from './roles';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        provider: string | null;
        rol: RolesEnum;
      };
    }
  }
}

export {};
