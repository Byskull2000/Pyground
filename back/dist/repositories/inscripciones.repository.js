"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocenteEdicion = exports.deleteInscripcion = exports.updateInscripcion = exports.createInscripcion = exports.getInscripcionStatus = exports.getInscripcionesByUsuario = exports.getInscripcionById = exports.getInscripcionesByEdicion = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getInscripcionesByEdicion = async (id) => {
    return prisma_1.default.inscripcion.findMany({
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
exports.getInscripcionesByEdicion = getInscripcionesByEdicion;
const getInscripcionById = async (id) => {
    return prisma_1.default.inscripcion.findUnique({
        where: { id },
        include: {
            edicion: true,
            usuario: true,
            cargo: true,
        },
    });
};
exports.getInscripcionById = getInscripcionById;
const getInscripcionesByUsuario = async (id) => {
    return prisma_1.default.inscripcion.findMany({
        where: { usuario_id: id },
        include: {
            edicion: true,
            usuario: true,
            cargo: true,
        },
    });
};
exports.getInscripcionesByUsuario = getInscripcionesByUsuario;
const getInscripcionStatus = async (usuario_id, edicion_id) => {
    return prisma_1.default.inscripcion.findFirst({
        where: { usuario_id, edicion_id },
        include: {
            edicion: true,
            usuario: true,
            cargo: true,
        },
    });
};
exports.getInscripcionStatus = getInscripcionStatus;
const createInscripcion = async (data) => {
    return prisma_1.default.inscripcion.create({
        data: {
            ...data,
            activo: true,
        },
    });
};
exports.createInscripcion = createInscripcion;
const updateInscripcion = async (id, data) => {
    return prisma_1.default.inscripcion.update({
        where: { id },
        data,
    });
};
exports.updateInscripcion = updateInscripcion;
const deleteInscripcion = async (id) => {
    const existing = await prisma_1.default.inscripcion.findUnique({ where: { id } });
    if (!existing) {
        throw new Error(`No existe una inscripción con ID ${id}`);
    }
    return prisma_1.default.inscripcion.update({
        where: { id },
        data: { activo: false },
    });
};
exports.deleteInscripcion = deleteInscripcion;
const createDocenteEdicion = async (id_edicion, id_usuario) => {
    const cargoDocente = await prisma_1.default.cargo.findUnique({
        where: { nombre: "Docente" },
    });
    if (!cargoDocente) {
        throw new Error('El cargo "Docente" no existe en la base de datos.');
    }
    return prisma_1.default.inscripcion.create({
        data: {
            usuario_id: id_usuario,
            edicion_id: id_edicion,
            cargo_id: cargoDocente.id,
            fecha_inscripcion: new Date(),
            activo: true,
        }
    });
};
exports.createDocenteEdicion = createDocenteEdicion;
