// src/server.ts
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
  res.json({ status: 'OK', message: 'Server is running' });
});


app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

export default app;