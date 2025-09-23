import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, JWTPayload, IUser } from '../types';

export const authMiddleware = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Acceso denegado. No token provided.' 
      });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const user: IUser | null = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Token inválido.' 
      });
      return;
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token inválido.' 
    });
  }
};