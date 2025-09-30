// src/routes/protected.ts
// Ejemplo de cómo usar el middleware de autenticación en tus rutas

import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '../../generated';

const router = express.Router();
const prisma = new PrismaClient();

// Ejemplo: Ruta protegida para actualizar perfil
router.put('/profile', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, bio } = req.body;
    
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(bio !== undefined && { bio })
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        avatar_url: true,
        bio: true
      }
    });

    res.json({ 
      message: 'Profile updated successfully',
      user: usuarioActualizado 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      error: 'Failed to update profile' 
    });
  }
});

// Ejemplo: Obtener datos del usuario autenticado
router.get('/dashboard', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
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
        fecha_registro: true,
        ultimo_acceso: true
      }
    });

    res.json({ 
      message: 'Welcome to your dashboard',
      user: usuario 
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to load dashboard' 
    });
  }
});

export default router;