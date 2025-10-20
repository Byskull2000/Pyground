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
exports.assignRol = exports.deleteUsuario = exports.updateUsuario = exports.createUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const RolEnum_1 = require("../utils/RolEnum");
const userRepo = __importStar(require("../repositories/usuarios.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailService = __importStar(require("./email.service"));
const getUsuarios = () => {
    return userRepo.getAllUsuarios();
};
exports.getUsuarios = getUsuarios;
const getUsuario = (id) => {
    return userRepo.getUsuarioById(id);
};
exports.getUsuario = getUsuario;
const createUsuario = async (data) => {
    const { email, password } = data;
    if (!email)
        throw { status: 400, message: 'El email es obligatorio' };
    if (!isValidEmail(email))
        throw { status: 400, message: 'Email inválido' };
    if (!password)
        throw { status: 400, message: 'La contraseña es obligatoria' };
    if (password.length < 7)
        throw { status: 400, message: 'La contraseña es demasiado corta' };
    if (!isStrongPassword(password))
        throw { status: 400, message: 'La contraseña no cumple requisitos de seguridad' };
    const existingUser = await userRepo.getUsuarioByEmail(email);
    if (existingUser)
        throw { status: 409, message: 'El email ya está registrado' };
    const saltRounds = 10;
    const password_hash = await bcrypt_1.default.hash(password, saltRounds);
    const codigo_verificacion = emailService.generarCodigoVerificacion();
    const codigo_expiracion = emailService.calcularExpiracion();
    const newUserData = {
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        password_hash,
        activo: false,
        email_verificado: false,
        codigo_verificacion,
        codigo_expiracion,
    };
    const newUser = await userRepo.createUsuario(newUserData);
    try {
        await emailService.enviarEmailVerificacion(newUser.email, newUser.nombre, codigo_verificacion);
    }
    catch (error) {
        console.error('Error al enviar email de verificación:', error);
    }
    return {
        ...newUser,
        mensaje: 'Usuario registrado. Por favor verifica tu email con el código enviado.'
    };
};
exports.createUsuario = createUsuario;
const updateUsuario = (id, data) => {
    return userRepo.updateUsuario(id, data);
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = (id) => {
    return userRepo.deleteUsuario(id);
};
exports.deleteUsuario = deleteUsuario;
const assignRol = async (id, rol) => {
    let rolEnum;
    try {
        rolEnum = (0, RolEnum_1.stringToRolEnum)(rol);
    }
    catch {
        throw { status: 400, message: 'Rol no válido' };
    }
    const user = await userRepo.getUsuarioById(id);
    if (!user) {
        throw { status: 404, message: 'Usuario no encontrado' };
    }
    try {
        const updatedUser = await userRepo.updateRol(id, rolEnum);
        return { message: 'Rol asignado correctamente', user: updatedUser };
    }
    catch {
        throw { status: 500, message: 'Error al asignar rol' };
    }
};
exports.assignRol = assignRol;
const isValidEmail = (email) => {
    // Regex simple para validar email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const isStrongPassword = (password) => {
    // Al menos 7 caracteres, una mayúscula y un número
    return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password);
};
