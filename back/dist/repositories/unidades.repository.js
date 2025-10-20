"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneFromPlantillas = exports.deleteUnidad = exports.updateUnidad = exports.createUnidad = exports.getUnidadById = exports.getUnidadesByEdicion = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUnidadesByEdicion = async (id_edicion) => {
    return prisma_1.default.unidad.findMany({
        where: {
            id_edicion
        }
    });
};
exports.getUnidadesByEdicion = getUnidadesByEdicion;
const getUnidadById = async (id) => {
    return prisma_1.default.unidad.findUnique({
        where: { id },
        include: {
            edicion: true
        }
    });
};
exports.getUnidadById = getUnidadById;
const createUnidad = async (data) => {
    return prisma_1.default.unidad.create({
        data,
    });
};
exports.createUnidad = createUnidad;
const updateUnidad = async (id, data) => {
    return prisma_1.default.unidad.update({
        where: { id },
        data,
    });
};
exports.updateUnidad = updateUnidad;
const deleteUnidad = async (id) => {
    return prisma_1.default.unidad.update({
        where: { id },
        data: {
            activo: false
        }
    });
};
exports.deleteUnidad = deleteUnidad;
const cloneFromPlantillas = async (unidadesPlantilla, id_edicion) => {
    if (!unidadesPlantilla || unidadesPlantilla.length === 0)
        return [];
    const data = unidadesPlantilla.map((u) => ({
        id_edicion,
        id_unidad_plantilla: u.id,
        titulo: u.titulo,
        descripcion: u.descripcion,
        orden: u.orden,
        icono: u.icono,
        color: u.color,
        activo: true,
        fecha_creacion: new Date()
    }));
    return prisma_1.default.unidad.createMany({
        data,
    });
};
exports.cloneFromPlantillas = cloneFromPlantillas;
