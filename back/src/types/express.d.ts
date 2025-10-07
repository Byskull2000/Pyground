// back/src/types/express.d.ts
// Extensión de tipos para Express Request

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        provider: string | null;
      };
    }
  }
}

export {};