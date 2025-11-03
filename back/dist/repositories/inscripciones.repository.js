"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEstudianteEdicion = exports.createEditorEdicion = exports.createDocenteEdicion = exports.deleteInscripcion = exports.upsertInscripcion = exports.updateInscripcion = exports.createInscripcion = exports.getInscripcionStatus = exports.getInscripcionesByUsuario = exports.getInscripcionById = exports.getEstudiantesByEdicion = exports.getInscripcionesByEdicion = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getInscripcionesByEdicion = async (id) => {
    return prisma_1.default.inscripcion.findMany({
        where: {
            edicion_id: id,
            activo: true,
        },
        include: {
            edicion: true,
            cargo: true,
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    avatar_url: true,
                    email: true,
                },
            },
        },
        orderBy: {
            fecha_inscripcion: 'desc',
        },
    });
};
exports.getInscripcionesByEdicion = getInscripcionesByEdicion;
const getEstudiantesByEdicion = async (id) => {
    return prisma_1.default.inscripcion.findMany({
        where: {
            edicion_id: id,
            activo: true,
            cargo: {
                nombre: 'Estudiante'
            }
        },
        include: {
            edicion: true,
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    avatar_url: true,
                    email: true,
                },
            },
            cargo: true,
        },
        orderBy: {
            fecha_inscripcion: 'desc',
        },
    });
};
exports.getEstudiantesByEdicion = getEstudiantesByEdicion;
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
const upsertInscripcion = async (data) => {
    return prisma_1.default.inscripcion.upsert({
        where: {
            usuario_id_edicion_id: {
                usuario_id: data.usuario_id,
                edicion_id: data.edicion_id,
            },
        },
        update: {
            cargo_id: data.cargo_id,
            activo: true,
            fecha_inscripcion: data.fecha_inscripcion ?? new Date(),
            fecha_terminacion: data.fecha_terminacion ?? null,
        },
        create: {
            ...data,
            activo: true,
        },
    });
};
exports.upsertInscripcion = upsertInscripcion;
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
const createEditorEdicion = async (id_edicion, id_usuario) => {
    const cargoEditor = await prisma_1.default.cargo.findUnique({
        where: { nombre: "Editor" },
    });
    if (!cargoEditor) {
        throw new Error('El cargo "Editor" no existe en la base de datos.');
    }
    return prisma_1.default.inscripcion.create({
        data: {
            usuario_id: id_usuario,
            edicion_id: id_edicion,
            cargo_id: cargoEditor.id,
            fecha_inscripcion: new Date(),
            activo: true,
        }
    });
};
exports.createEditorEdicion = createEditorEdicion;
const createEstudianteEdicion = async (id_edicion, id_usuario) => {
    const cargoEstudiante = await prisma_1.default.cargo.findUnique({
        where: { nombre: "Estudiante" },
    });
    if (!cargoEstudiante) {
        throw new Error('El cargo "Estudiante" no existe en la base de datos.');
    }
    return prisma_1.default.inscripcion.create({
        data: {
            usuario_id: id_usuario,
            edicion_id: id_edicion,
            cargo_id: cargoEstudiante.id,
            fecha_inscripcion: new Date(),
            activo: true,
        }
    });
};
exports.createEstudianteEdicion = createEstudianteEdicion;
