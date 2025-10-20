"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/passport.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error('No email found in Google profile'), undefined);
        const googleId = profile.id;
        const nombre = profile.name?.givenName || '';
        const apellido = profile.name?.familyName || '';
        const avatar_url = profile.photos?.[0]?.value || null;
        let usuario = await prisma.usuario.findUnique({ where: { google_id: googleId } });
        if (!usuario) {
            const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
            if (usuarioExistente) {
                usuario = await prisma.usuario.update({
                    where: { email },
                    data: {
                        google_id: googleId,
                        provider: 'google',
                        avatar_url: avatar_url || usuarioExistente.avatar_url,
                        ultimo_acceso: new Date(),
                    },
                });
            }
            else {
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
                        ultimo_acceso: new Date(),
                    },
                });
            }
        }
        else {
            usuario = await prisma.usuario.update({
                where: { id: usuario.id },
                data: { ultimo_acceso: new Date() },
            });
        }
        return done(null, usuario);
    }
    catch (error) {
        console.error('Error en Google Strategy:', error);
        return done(error, undefined);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const usuario = await prisma.usuario.findUnique({ where: { id } });
        done(null, usuario);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
