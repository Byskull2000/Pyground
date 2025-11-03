// back/src/routes/auth.routes.ts
import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
import { authRequired } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../generated/prisma';
import prisma from '../config/prisma';

interface JWTPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

const router = express.Router();

// ==================== AUTENTICACIÓN LOCAL ====================


// Login de usuario
router.post('/login', authController.login);
//cora
router.post('/verify-email', authController.verificarEmail);
router.post('/resend-verification', authController.reenviarCodigo);
router.post('/send-verification-email', authController.enviarEmailVerificacion);
// Cambiar contraseña (requiere autenticación)
//router.put('/change-password', authenticateToken, authController.changePassword);

// ==================== AUTENTICACIÓN CON GOOGLE ====================

// Generar JWT
const generateToken = (user: Usuario): string => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol
    },
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
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      const usuario = req.user as Usuario;
      const token = generateToken(usuario);

      const userData = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        avatar_url: usuario.avatar_url,
        provider: usuario.provider,
        rol: usuario.rol
      };

      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error en callback:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
    }
  }
);

// ==================== RUTAS DE VERIFICACIÓN ====================

// Verificar token
router.get('/verify', async (req, res) => {
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
  } catch {
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

// Obtener información del usuario autenticado
router.get('/me', authRequired, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autorizado' 
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        avatar_url: true,
        bio: true,
        provider: true,
        activo: true,
        fecha_registro: true,
        ultimo_acceso: true
      }
    });

    if (!usuario || !usuario.activo) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado o inactivo' 
      });
    }

    res.json({ user: usuario });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener información del usuario' 
    });
  }
});

// Logout (opcional - más usado en frontend)
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al cerrar sesión' 
      });
    }
    res.json({ 
      message: 'Sesión cerrada correctamente' 
    });
  });
});

export default router;