import prisma from '../config/prisma';
import { InscripcionCreate, InscripcionUpdate } from '../types/inscripciones.types';

export const getInscripcionesByEdicion = async (id: number) => {
  return prisma.inscripcion.findMany({
    where: {
      edicion_id: id,
      activo: true,
    },
    include: {
      edicion: true,
      usuario: true,
      cargo: true,
    },
    orderBy: {
      fecha_inscripcion: 'desc',
    },
  });
};

export const getInscripcionById = async (id: number) => {
  return prisma.inscripcion.findUnique({
    where: { id },
    include: {
      edicion: true,
      usuario: true,
      cargo: true,
    },
  });
};

export const getInscripcionesByUsuario = async (id: number) => {
  return prisma.inscripcion.findMany({
    where: { usuario_id : id },
    include: {
      edicion: true,
      usuario: true,
      cargo: true,
    },
  });
};

export const getInscripcionStatus = async (usuario_id: number, edicion_id: number) => {
  return prisma.inscripcion.findFirst({
    where: { usuario_id, edicion_id },
    include: {
      edicion: true,
      usuario: true,
      cargo: true,
    },
  });
};

export const createInscripcion = async (data: InscripcionCreate) => {
  return prisma.inscripcion.create({
    data: {
      ...data,
      activo: true,
    },
  });
};

export const updateInscripcion = async (id: number, data: InscripcionUpdate) => {
  return prisma.inscripcion.update({
    where: { id },
    data,
  });
};

export const deleteInscripcion = async (id: number) => {
  const existing = await prisma.inscripcion.findUnique({ where: { id } });

  if (!existing) {
    throw new Error(`No existe una inscripción con ID ${id}`);
  }

  return prisma.inscripcion.update({
    where: { id },
    data: { activo: false },
  });
};

export const createDocenteEdicion = async (id_edicion: number, id_usuario: number) => {
  const cargoDocente = await prisma.cargo.findUnique({
    where: { nombre: "Docente" },
  });

  if (!cargoDocente) {
    throw new Error('El cargo "Docente" no existe en la base de datos.');
  }

  return prisma.inscripcion.create({
    data: {
      usuario_id: id_usuario,
      edicion_id: id_edicion,
      cargo_id: cargoDocente.id,
      fecha_inscripcion: new Date(),
      activo: true,
    }
  });
};
