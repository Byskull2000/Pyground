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
exports.enviarEmailVerificacion = exports.reenviarCodigo = exports.verificarEmail = exports.login = void 0;
const authService = __importStar(require("../services/auth.service"));
const emailService = __importStar(require("../services/email.service"));
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = __importDefault(require("../config/prisma"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validación de campos requeridos
        if (!email || !password) {
            return res
                .status(400)
                .json(new apiResponse_1.ApiResponse(false, null, 'Email y password son requeridos'));
        }
        const result = await authService.loginUser(email, password);
        res.json(new apiResponse_1.ApiResponse(true, result, 'Inicio de sesión exitoso'));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message === 'Invalid credentials') {
            return res.status(401).json(new apiResponse_1.ApiResponse(false, null, 'Credenciales inválidas'));
        }
        if (message === 'User not found') {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        }
        if (message === 'Email not verified') {
            return res
                .status(403)
                .json(new apiResponse_1.ApiResponse(false, null, 'Por favor verifica tu email antes de iniciar sesión'));
        }
        if (message === 'Account inactive') {
            return res
                .status(403)
                .json(new apiResponse_1.ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador'));
        }
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al iniciar sesión'));
    }
};
exports.login = login;
const verificarEmail = async (req, res) => {
    try {
        const { email, codigo } = req.body;
        if (!email || !codigo) {
            return res
                .status(400)
                .json(new apiResponse_1.ApiResponse(false, null, 'Email y código son requeridos'));
        }
        const result = await authService.verificarEmail(email, codigo);
        res.json(new apiResponse_1.ApiResponse(true, result, 'Email verificado exitosamente'));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message === 'User not found') {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        }
        if (message === 'Email already verified') {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'El email ya está verificado'));
        }
        if (message === 'No verification code found') {
            return res
                .status(400)
                .json(new apiResponse_1.ApiResponse(false, null, 'No se encontró código de verificación'));
        }
        if (message === 'Verification code expired') {
            return res
                .status(400)
                .json(new apiResponse_1.ApiResponse(false, null, 'El código de verificación ha expirado'));
        }
        if (message === 'Invalid verification code') {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Código de verificación inválido'));
        }
        console.error('Error al verificar email:', err);
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al verificar email'));
    }
};
exports.verificarEmail = verificarEmail;
const reenviarCodigo = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Email es requerido'));
        }
        const result = await authService.reenviarCodigoVerificacion(email);
        res.json(new apiResponse_1.ApiResponse(true, result, 'Código reenviado exitosamente'));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message === 'User not found') {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        }
        if (message === 'Email already verified') {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Email ya verificado'));
        }
        if (message === 'Error al enviar email de verificación') {
            return res
                .status(500)
                .json(new apiResponse_1.ApiResponse(false, null, 'Error al enviar el código'));
        }
        console.error('Error al reenviar código:', err);
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al reenviar código'));
    }
};
exports.reenviarCodigo = reenviarCodigo;
//Enviar email de verificación directamente
const enviarEmailVerificacion = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Email es requerido'));
        }
        // Buscar usuario
        const usuario = await prisma_1.default.usuario.findUnique({
            where: { email }
        });
        if (!usuario) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        }
        if (usuario.email_verificado) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'El email ya está verificado'));
        }
        // Generar nuevo código si no existe o está expirado
        let codigoActual = usuario.codigo_verificacion;
        let expiracionActual = usuario.codigo_expiracion;
        if (!codigoActual || !expiracionActual || new Date() > expiracionActual) {
            codigoActual = emailService.generarCodigoVerificacion();
            expiracionActual = emailService.calcularExpiracion();
            // Actualizar código en BD
            await prisma_1.default.usuario.update({
                where: { id: usuario.id },
                data: {
                    codigo_verificacion: codigoActual,
                    codigo_expiracion: expiracionActual
                }
            });
        }
        // Enviar email
        await emailService.enviarEmailVerificacion(usuario.email, usuario.nombre, codigoActual);
        res.json(new apiResponse_1.ApiResponse(true, { message: 'Email de verificación enviado' }, 'Email enviado exitosamente'));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Error al enviar email de verificación:', err);
        if (message === 'Error al enviar email de verificación') {
            return res
                .status(500)
                .json(new apiResponse_1.ApiResponse(false, null, 'Error al enviar el email. Intenta nuevamente.'));
        }
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al enviar email de verificación'));
    }
};
exports.enviarEmailVerificacion = enviarEmailVerificacion;
