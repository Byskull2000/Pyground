"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRol = exports.deleteUsuario = exports.updateUsuario = exports.createUsuario = exports.getUsuarioByEmail = exports.getUsuarioById = exports.getAllUsuarios = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllUsuarios = async () => {
    return prisma_1.default.usuario.findMany({
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            rol: true
        }
    });
};
exports.getAllUsuarios = getAllUsuarios;
const getUsuarioById = async (id) => {
    return prisma_1.default.usuario.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            rol: true
        }
    });
};
exports.getUsuarioById = getUsuarioById;
const getUsuarioByEmail = async (email) => {
    return prisma_1.default.usuario.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            password_hash: true,
            activo: true,
            email_verificado: true,
            rol: true
        }
    });
};
exports.getUsuarioByEmail = getUsuarioByEmail;
const createUsuario = async (data) => {
    return prisma_1.default.usuario.create({
        data,
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            rol: true
        }
    });
};
exports.createUsuario = createUsuario;
const updateUsuario = async (id, data) => {
    return prisma_1.default.usuario.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            rol: true
        }
    });
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (id) => {
    return prisma_1.default.usuario.delete({
        where: { id },
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            avatar_url: true,
            bio: true,
            provider: true,
            fecha_registro: true,
            ultimo_acceso: true,
            rol: true
        }
    });
};
exports.deleteUsuario = deleteUsuario;
const updateRol = async (id, rol) => {
    return prisma_1.default.usuario.update({
        where: { id },
        data: { rol },
        select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            rol: true
        }
    });
};
exports.updateRol = updateRol;
