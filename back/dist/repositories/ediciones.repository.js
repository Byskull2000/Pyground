"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEdicion = exports.updateEdicion = exports.createEdicion = exports.getEdicionById = exports.getEdicionesByCursoAndNombre = exports.getEdicionesByCurso = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getEdicionesByCurso = async (id) => {
    return prisma_1.default.edicion.findMany({
        where: {
            activo: true,
            id_curso: id
        }
    });
};
exports.getEdicionesByCurso = getEdicionesByCurso;
const getEdicionesByCursoAndNombre = async (id, nombre) => {
    return prisma_1.default.edicion.findMany({
        where: {
            activo: true,
            id_curso: id,
            nombre_edicion: nombre
        }
    });
};
exports.getEdicionesByCursoAndNombre = getEdicionesByCursoAndNombre;
const getEdicionById = async (id) => {
    return prisma_1.default.edicion.findUnique({
        where: { id },
        include: {
            unidades: true,
            curso: true
        }
    });
};
exports.getEdicionById = getEdicionById;
const createEdicion = async (data) => {
    const { id_curso, nombre_edicion, descripcion, fecha_apertura, fecha_cierre, creado_por, } = data;
    return prisma_1.default.edicion.create({
        data: {
            id_curso,
            nombre_edicion,
            descripcion,
            fecha_apertura,
            fecha_cierre,
            creado_por
        },
        include: {
            unidades: true,
        },
    });
};
exports.createEdicion = createEdicion;
const updateEdicion = async (id, data) => {
    return prisma_1.default.edicion.update({
        where: { id },
        data,
        include: {
            unidades: true
        }
    });
};
exports.updateEdicion = updateEdicion;
const deleteEdicion = async (id) => {
    return prisma_1.default.edicion.update({
        where: { id },
        data: {
            activo: false
        },
    });
};
exports.deleteEdicion = deleteEdicion;
