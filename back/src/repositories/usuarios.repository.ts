import prisma from '../config/prisma';
import { UsuarioCreate, UsuarioUpdate } from '../types/usuarios.types';


export const getAllUsuarios = async () => {
  return prisma.usuario.findMany();
};

export const getUsuarioById = async (id: number) => {
  return prisma.usuario.findUnique({
    where: { id }
  });
};

export const createUsuario = async (data: UsuarioCreate) => {
  return prisma.usuario.create({
    data
  });
};

export const updateUsuario = async (id: number, data: UsuarioUpdate) => {
  return prisma.usuario.update({
    where: { id },
    data
  });
};

export const deleteUsuario = async (id: number) => {
  return prisma.usuario.delete({
    where: { id }
  });
};
