// src/server.ts
import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
//import authRoutes from './routes/auth';
import authRoutes from './routes/auth.routes';
import routes from './routes/api.routes';
import protectedRoutes from './routes/protected';


const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static('uploads'));


app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));


app.use(passport.initialize());
app.use(passport.session());

import './config/passport';

app.use('/api', routes);

app.use('/api/auth', authRoutes);

app.use('/api/protected', protectedRoutes);


app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running Test CD' });
});


import { NextFunction } from 'express';

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error((err as Error).stack ?? err);
  void _next;
  const message = (err as Error).message ?? 'Internal server error';
  res.status(500).json({
    error: 'Something went wrong!',
    message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

export default app;