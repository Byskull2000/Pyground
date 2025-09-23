import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, JWTPayload, AuthResponse, IUser } from '../types';

export const getCurrentUser = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const user: IUser | null = await User.findById(decoded.id).select('-googleId');
    
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
      return;
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

export const logout = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  req.logout((err) => {
    if (err) {
      console.error('Error en logout:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error al cerrar sesión' 
      });
      return;
    }
    res.json({ 
      success: true, 
      message: 'Sesión cerrada exitosamente' 
    });
  });
};

export const googleCallback = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
      return;
    }

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );
    
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Error en googleCallback:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};