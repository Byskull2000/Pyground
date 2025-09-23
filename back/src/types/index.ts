import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cambia AuthRequest para usar la extensión de Express
export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: IUser;
  token?: string;
}