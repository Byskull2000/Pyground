"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneFromPlantillas = exports.deactivateUnidad = exports.publicateUnidad = exports.restoreUnidad = exports.deleteUnidad = exports.updateUnidad = exports.createUnidad = exports.getUnidadById = exports.getUnidadRedudante = exports.getUnidadesByEdicion = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUnidadesByEdicion = async (id_edicion) => {
    return prisma_1.default.unidad.findMany({
        where: {
            id_edicion
        }
    });
};
exports.getUnidadesByEdicion = getUnidadesByEdicion;
const getUnidadRedudante = async (id_edicion, titulo) => {
    return prisma_1.default.unidad.findFirst({
        where: {
            id_edicion,
            titulo: {
                equals: titulo,
                mode: 'insensitive',
            },
        }
    });
};
exports.getUnidadRedudante = getUnidadRedudante;
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
    const mappedData = {
        id_edicion: data.id_edicion,
        id_unidad_plantilla: data.id_unidad_plantilla ?? null,
        titulo: data.titulo,
        descripcion: data.descripcion ?? null,
        orden: data.orden,
        icono: data.icono ?? null,
        color: data.color ?? null,
        activo: data.activo ?? true
    };
    return prisma_1.default.unidad.create({
        data: mappedData,
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
const restoreUnidad = async (id) => {
    return prisma_1.default.unidad.update({
        where: { id },
        data: {
            activo: true
        }
    });
};
exports.restoreUnidad = restoreUnidad;
const publicateUnidad = async (id) => {
    return prisma_1.default.unidad.update({
        where: { id },
        data: {
            estado_publicado: true,
            activo: true
        },
    });
};
exports.publicateUnidad = publicateUnidad;
const deactivateUnidad = async (id) => {
    return prisma_1.default.unidad.update({
        where: { id },
        data: {
            estado_publicado: false
        },
    });
};
exports.deactivateUnidad = deactivateUnidad;
const cloneFromPlantillas = async (unidadesPlantilla, id_edicion) => {
    if (!unidadesPlantilla || unidadesPlantilla.length === 0)
        return {};
    const unidadMap = {}; // { id_unidad_plantilla: id_unidad_clonada }
    await Promise.all(unidadesPlantilla.map(async (u) => {
        const nuevaUnidad = await prisma_1.default.unidad.create({
            data: {
                id_edicion,
                id_unidad_plantilla: u.id,
                titulo: u.titulo,
                descripcion: u.descripcion,
                orden: u.orden,
                icono: u.icono,
                color: u.color,
                activo: true,
                fecha_creacion: new Date(),
            },
        });
        unidadMap[u.id] = nuevaUnidad.id;
    }));
    return unidadMap;
};
exports.cloneFromPlantillas = cloneFromPlantillas;
