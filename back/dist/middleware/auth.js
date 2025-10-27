"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authRequired = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Middleware para proteger rutas
const authRequired = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Access denied. No token provided.'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verificar token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Buscar usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.id }
        });
        if (!usuario || !usuario.activo) {
            res.status(403).json({
                error: 'User not found or inactive'
            });
            return;
        }
        // Agregar usuario al request
        req.user = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            provider: usuario.provider,
            rol: usuario.rol
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                error: 'Invalid token'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                error: 'Token expired'
            });
            return;
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};
exports.authRequired = authRequired;
// Middleware opcional (permite acceso sin token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.id }
        });
        if (usuario && usuario.activo) {
            req.user = {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                provider: usuario.provider,
                rol: usuario.rol
            };
        }
        next();
    }
    catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        next();
    }
};
exports.optionalAuth = optionalAuth;
