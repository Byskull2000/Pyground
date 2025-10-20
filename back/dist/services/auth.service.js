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
exports.verifyToken = exports.changePassword = exports.reenviarCodigoVerificacion = exports.verificarEmail = exports.loginUser = void 0;
exports.validateUser = validateUser;
// back/src/services/auth.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const userRepo = __importStar(require("../repositories/usuarios.repository"));
const emailService = __importStar(require("./email.service"));
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '7d';
// Generar JWT
const generateToken = (userId, email, nombre, apellido) => {
    return jsonwebtoken_1.default.sign({
        id: userId,
        email,
        nombre,
        apellido
    }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
// Login de usuario
const loginUser = async (email, password) => {
    // Buscar usuario por email
    const usuario = await userRepo.getUsuarioByEmail(email);
    if (!usuario) {
        throw new Error('User not found');
    }
    // Verificar si es usuario local (no OAuth)
    if (!usuario.password_hash) {
        throw new Error('Invalid credentials');
    }
    // Comparar contraseñas
    const isPasswordValid = await bcrypt_1.default.compare(password, usuario.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // Verificar si el email está verificado
    if (!usuario.email_verificado) {
        throw new Error('Email not verified');
    }
    // Verificar si el usuario está activo
    if (!usuario.activo) {
        throw new Error('Account inactive');
    }
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // Actualizar último acceso
    await prisma_1.default.usuario.update({
        where: { id: usuario.id },
        data: { ultimo_acceso: new Date() }
    });
    // Generar token
    const token = generateToken(usuario.id, usuario.email, usuario.nombre, usuario.apellido);
    // Eliminar password_hash de la respuesta
    const { password_hash, ...userWithoutPassword } = usuario;
    return {
        message: 'Login exitoso',
        token,
        user: userWithoutPassword
    };
};
exports.loginUser = loginUser;
const verificarEmail = async (email, codigo) => {
    const usuario = await prisma_1.default.usuario.findUnique({
        where: { email }
    });
    if (!usuario) {
        throw new Error('User not found');
    }
    if (usuario.email_verificado) {
        throw new Error('Email already verified');
    }
    if (!usuario.codigo_verificacion || !usuario.codigo_expiracion) {
        throw new Error('No verification code found');
    }
    // Verificar si el código expiró
    if (new Date() > usuario.codigo_expiracion) {
        throw new Error('Verification code expired');
    }
    // Verificar si el código coincide
    if (usuario.codigo_verificacion !== codigo) {
        throw new Error('Invalid verification code');
    }
    // Activar usuario y marcar email como verificado
    await prisma_1.default.usuario.update({
        where: { id: usuario.id },
        data: {
            email_verificado: true,
            activo: true,
            codigo_verificacion: null,
            codigo_expiracion: null
        }
    });
    // Enviar email de bienvenida
    try {
        await emailService.enviarEmailBienvenida(usuario.email, usuario.nombre);
    }
    catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
    }
    return { message: 'Email verificado exitosamente' };
};
exports.verificarEmail = verificarEmail;
const reenviarCodigoVerificacion = async (email) => {
    const usuario = await prisma_1.default.usuario.findUnique({
        where: { email }
    });
    if (!usuario) {
        throw new Error('User not found');
    }
    if (usuario.email_verificado) {
        throw new Error('Email already verified');
    }
    // Generar nuevo código
    const codigo_verificacion = emailService.generarCodigoVerificacion();
    const codigo_expiracion = emailService.calcularExpiracion();
    // Actualizar código en BD
    await prisma_1.default.usuario.update({
        where: { id: usuario.id },
        data: {
            codigo_verificacion,
            codigo_expiracion
        }
    });
    // Enviar email
    await emailService.enviarEmailVerificacion(usuario.email, usuario.nombre, codigo_verificacion);
    return { message: 'Código de verificación reenviado' };
};
exports.reenviarCodigoVerificacion = reenviarCodigoVerificacion;
// Cambiar contraseña
const changePassword = async (userId, currentPassword, newPassword) => {
    // Buscar usuario
    const usuario = await prisma_1.default.usuario.findUnique({
        where: { id: userId },
        select: {
            id: true,
            password_hash: true,
            provider: true
        }
    });
    if (!usuario) {
        throw new Error('User not found');
    }
    // Verificar que sea usuario local
    if (usuario.provider !== 'local' || !usuario.password_hash) {
        throw new Error('Password change not available for OAuth users');
    }
    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, usuario.password_hash);
    if (!isCurrentPasswordValid) {
        throw new Error('Invalid current password');
    }
    // Hashear nueva contraseña
    const newPasswordHash = await bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
    // Actualizar contraseña
    await prisma_1.default.usuario.update({
        where: { id: userId },
        data: { password_hash: newPasswordHash }
    });
    return { message: 'Password changed successfully' };
};
exports.changePassword = changePassword;
// Verificar token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
function validateUser() {
    throw new Error('Function not implemented.');
}
