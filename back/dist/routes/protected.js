"use strict";
// src/routes/protected.ts
// Ejemplo de cómo usar el middleware de autenticación en tus rutas
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../../generated/prisma");
const router = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
// Ejemplo: Ruta protegida para actualizar perfil
router.put('/profile', auth_1.authRequired, async (req, res) => {
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
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            error: 'Failed to update profile'
        });
    }
});
// Ejemplo: Obtener datos del usuario autenticado
router.get('/dashboard', auth_1.authRequired, async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({
            error: 'Failed to load dashboard'
        });
    }
});
exports.default = router;
