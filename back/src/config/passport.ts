// src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient } from '../../generated/prisma';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Extraer información del perfil de Google
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        const googleId = profile.id;
        const nombre = profile.name?.givenName || '';
        const apellido = profile.name?.familyName || '';
        const avatar_url = profile.photos?.[0]?.value || null;

        // Buscar o crear usuario
        let usuario = await prisma.usuario.findUnique({
          where: { google_id: googleId }
        });

        if (!usuario) {
          // Verificar si existe un usuario con ese email
          const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
          });

          if (usuarioExistente) {
            // Actualizar usuario existente con Google ID
            usuario = await prisma.usuario.update({
              where: { email },
              data: {
                google_id: googleId,
                provider: 'google',
                avatar_url: avatar_url || usuarioExistente.avatar_url,
                ultimo_acceso: new Date()
              }
            });
          } else {
            // Crear nuevo usuario
            usuario = await prisma.usuario.create({
              data: {
                email,
                google_id: googleId,
                nombre,
                apellido,
                avatar_url,
                provider: 'google',
                password_hash: null,
                activo: true,
                ultimo_acceso: new Date()
              }
            });
          }
        } else {
          // Actualizar último acceso
          usuario = await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimo_acceso: new Date() }
          });
        }

        return done(null, usuario as Express.User);
      } catch (error) {
        console.error('Error en Google Strategy:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

// Serializar usuario para la sesión
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserializar usuario desde la sesión
passport.deserializeUser(async (id: number, done) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });
    done(null, usuario as Express.User);
  } catch (error) {
    done(error, null);
  }
});

export default passport;