"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// back/src/routes/auth.routes.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController = __importStar(require("../controllers/auth.controller"));
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../generated/prisma");
const router = express_1.default.Router();
// ==================== AUTENTICACIÓN LOCAL ====================
// Login de usuario
router.post('/login', authController.login);
//cora
router.post('/verify-email', authController.verificarEmail);
router.post('/resend-verification', authController.reenviarCodigo);
router.post('/send-verification-email', authController.enviarEmailVerificacion);
// Cambiar contraseña (requiere autenticación)
//router.put('/change-password', authenticateToken, authController.changePassword);
// ==================== AUTENTICACIÓN CON GOOGLE ====================
// Generar JWT
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// Ruta para iniciar autenticación con Google
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
// Callback de Google después de autenticación
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false
}), (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
        }
        const usuario = req.user;
        const token = generateToken(usuario);
        const userData = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            avatar_url: usuario.avatar_url,
            provider: usuario.provider,
            rol: usuario.rol
        };
        const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
        res.redirect(redirectUrl);
    }
    catch (error) {
        console.error('Error en callback:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
    }
});
// ==================== RUTAS DE VERIFICACIÓN ====================
// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.json({
            valid: true,
            user: decoded
        });
    }
    catch {
        res.status(401).json({
            valid: false,
            error: 'Invalid token'
        });
    }
});
// Obtener información del usuario autenticado
router.get('/me', auth_1.authRequired, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'No autorizado'
            });
        }
        const prisma = new prisma_1.PrismaClient();
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                nombre: true,
                apellido: true,
                avatar_url: true,
                bio: true,
                provider: true,
                activo: true,
                fecha_registro: true,
                ultimo_acceso: true
            }
        });
        if (!usuario || !usuario.activo) {
            return res.status(404).json({
                error: 'Usuario no encontrado o inactivo'
            });
        }
        res.json({ user: usuario });
    }
    catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({
            error: 'Error al obtener información del usuario'
        });
    }
});
// Logout (opcional - más usado en frontend)
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al cerrar sesión'
            });
        }
        res.json({
            message: 'Sesión cerrada correctamente'
        });
    });
});
exports.default = router;
