// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

interface JWTPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
}

// Middleware para proteger rutas
export const authRequired = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || !usuario.activo) {
      res.status(403).json({ 
        error: 'User not found or inactive' 
      });
      return;
    }

    // Agregar usuario al request
    (req.user as any) = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      provider: usuario.provider,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Invalid token' 
      });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired' 
      });
      return;
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Middleware opcional (permite acceso sin token)
export const optionalAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (usuario && usuario.activo) {
      (req.user as any) = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        provider: usuario.provider,
        rol: usuario.rol
      };
    }

    next();
  } catch (error) {
    next();
  }
};