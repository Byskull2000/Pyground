import { RolesEnum } from '../../generated/prisma';
import prisma from '../config/prisma';
import { UsuarioCreate, UsuarioUpdate } from '../types/usuarios.types';


export const getAllUsuarios = async () => {
  return prisma.usuario.findMany({
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

export const getUsuarioById = async (id: number) => {
  return prisma.usuario.findUnique({
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

export const getUsuarioByEmail = async (email: string) => {
  return prisma.usuario.findUnique({
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
      email_verificado: true
    }
  });
};

export const createUsuario = async (data: UsuarioCreate) => {
  return prisma.usuario.create({
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

export const updateUsuario = async (id: number, data: UsuarioUpdate) => {
  return prisma.usuario.update({
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

export const deleteUsuario = async (id: number) => {
  return prisma.usuario.delete({
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

export const updateRol = async (id: number, rol: RolesEnum) => {
  return prisma.usuario.update({
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
