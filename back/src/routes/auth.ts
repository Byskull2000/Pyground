// src/routes/auth.ts
import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../generated/prisma';

const router = express.Router();

// Interface para el payload del JWT
interface JWTPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string; // ⭐ AGREGAR
}

// Generar JWT
const generateToken = (user: Usuario): string => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol 
    } as JWTPayload,
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

// Ruta para iniciar autenticación con Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Callback de Google después de autenticación
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false 
  }),
  (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      const usuario = req.user as Usuario;

      // Generar JWT
      const token = generateToken(usuario);
      
      // Datos del usuario (sin información sensible)
      const userData = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        avatar_url: usuario.avatar_url,
        provider: usuario.provider,
        rol: usuario.rol 
      };

      // Redirigir al frontend con el token y datos del usuario
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error en callback:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
    }
  }
);

// Ruta para verificar token (middleware de autenticación)
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    res.json({ 
      valid: true, 
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

// Ruta para obtener información del usuario autenticado
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    const { PrismaClient } = require('../../generated/prisma');
    const prisma = new PrismaClient();
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        avatar_url: true,
        bio: true,
        provider: true,
        activo: true,
        rol: true,
        fecha_registro: true,
        ultimo_acceso: true
      }
    });

    if (!usuario || !usuario.activo) {
      return res.status(404).json({ 
        error: 'User not found or inactive' 
      });
    }

    res.json({ user: usuario });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
});

// Ruta de logout (opcional)
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Logout failed' 
      });
    }
    res.json({ 
      message: 'Logged out successfully' 
    });
  });
});

export default router;