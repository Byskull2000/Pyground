import prisma from '../config/prisma';

export const getCargos = async () => {
  return prisma.cargo.findMany();
};

export const getCargoByNombre = async (nombre: string) => {
  return prisma.cargo.findUnique({
    where: { nombre },
  });
};

export const getCargoById = async (id: number) => {
  return prisma.cargo.findUnique({
    where: { id },
  });
};