// back/src/tests/helpers/auth.helper.ts
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { RolesEnum } from '../../../generated/prisma';

export const JWT_SECRET = 'test-secret';

// Función para crear un usuario administrador y generar su token JWT
export const createAdminUserAndToken = async () => {
    // Crear usuario admin
    const admin = await prisma.usuario.create({
        data: {
            email: 'admin@test.com',
            nombre: 'Admin',
            apellido: 'Test',
            password_hash: 'hash',
            rol: RolesEnum.ADMIN,
            email_verificado: true,
            activo: true
        }
    });

    // Generar token JWT
    const token = jwt.sign(
        { 
            id: admin.id, 
            email: admin.email,
            nombre: admin.nombre,
            apellido: admin.apellido
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { admin, token };
};

// Función para crear un usuario académico y generar su token JWT
export const createAcademicoUserAndToken = async () => {
    const academico = await prisma.usuario.create({
        data: {
            email: 'academico@test.com',
            nombre: 'Academico',
            apellido: 'Test',
            password_hash: 'hash',
            rol: RolesEnum.ACADEMICO,
            email_verificado: true,
            activo: true
        }
    });

    const token = jwt.sign(
        { 
            id: academico.id, 
            email: academico.email,
            nombre: academico.nombre,
            apellido: academico.apellido
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { academico, token };
};

// Función para crear un usuario normal y generar su token JWT
export const createUserAndToken = async () => {
    const user = await prisma.usuario.create({
        data: {
            email: 'user@test.com',
            nombre: 'User',
            apellido: 'Test',
            password_hash: 'hash',
            rol: RolesEnum.USUARIO,
            email_verificado: true,
            activo: true
        }
    });

    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
};