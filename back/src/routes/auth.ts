import express, { Router, Request, Response } from 'express';
import passport from 'passport';
import { getCurrentUser, logout, googleCallback } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` 
  }),
  googleCallback
);

// @route   GET /api/auth/user
router.get('/user', getCurrentUser);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   GET /api/auth/profile
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Acceso a ruta protegida exitoso',
    user: req.user // Ahora TypeScript reconoce req.user como IUser
  });
});

export default router;