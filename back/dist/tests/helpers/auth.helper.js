"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAndToken = exports.createAcademicoUserAndToken = exports.createAdminUserAndToken = exports.JWT_SECRET = void 0;
// back/src/tests/helpers/auth.helper.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const prisma_2 = require("../../../generated/prisma");
exports.JWT_SECRET = 'test-secret';
// Función para crear un usuario administrador y generar su token JWT
const createAdminUserAndToken = async () => {
    // Crear usuario admin
    const admin = await prisma_1.default.usuario.create({
        data: {
            email: 'admin@test.com',
            nombre: 'Admin',
            apellido: 'Test',
            password_hash: 'hash',
            rol: prisma_2.RolesEnum.ADMIN,
            email_verificado: true,
            activo: true
        }
    });
    // Generar token JWT
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
        apellido: admin.apellido
    }, exports.JWT_SECRET, { expiresIn: '1h' });
    return { admin, token };
};
exports.createAdminUserAndToken = createAdminUserAndToken;
// Función para crear un usuario académico y generar su token JWT
const createAcademicoUserAndToken = async () => {
    const academico = await prisma_1.default.usuario.create({
        data: {
            email: 'academico@test.com',
            nombre: 'Academico',
            apellido: 'Test',
            password_hash: 'hash',
            rol: prisma_2.RolesEnum.ACADEMICO,
            email_verificado: true,
            activo: true
        }
    });
    const token = jsonwebtoken_1.default.sign({
        id: academico.id,
        email: academico.email,
        nombre: academico.nombre,
        apellido: academico.apellido
    }, exports.JWT_SECRET, { expiresIn: '1h' });
    return { academico, token };
};
exports.createAcademicoUserAndToken = createAcademicoUserAndToken;
// Función para crear un usuario normal y generar su token JWT
const createUserAndToken = async () => {
    const user = await prisma_1.default.usuario.create({
        data: {
            email: 'user@test.com',
            nombre: 'User',
            apellido: 'Test',
            password_hash: 'hash',
            rol: prisma_2.RolesEnum.USUARIO,
            email_verificado: true,
            activo: true
        }
    });
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido
    }, exports.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};
exports.createUserAndToken = createUserAndToken;
