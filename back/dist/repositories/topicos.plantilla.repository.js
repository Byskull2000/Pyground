"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxOrden = exports.deleteTopicoPlantilla = exports.updateTopicoPlantilla = exports.createTopicoPlantilla = exports.getTopicoPlantillaById = exports.getTopicosPlantillaByCurso = exports.getTopicosByUnidadPlantilla = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getTopicosByUnidadPlantilla = async (id_unidad_plantilla) => {
    return prisma_1.default.topicoPlantilla.findMany({
        where: {
            id_unidad_plantilla,
            activo: true,
        },
        orderBy: {
            orden: 'asc',
        },
    });
};
exports.getTopicosByUnidadPlantilla = getTopicosByUnidadPlantilla;
const getTopicosPlantillaByCurso = async (id_curso) => {
    return prisma_1.default.topicoPlantilla.findMany({
        where: {
            unidadPlantilla: {
                id_curso: id_curso,
            },
            activo: true,
        },
        orderBy: {
            orden: 'asc',
        },
    });
};
exports.getTopicosPlantillaByCurso = getTopicosPlantillaByCurso;
const getTopicoPlantillaById = async (id) => {
    return prisma_1.default.topicoPlantilla.findUnique({
        where: { id },
    });
};
exports.getTopicoPlantillaById = getTopicoPlantillaById;
const createTopicoPlantilla = async (data) => {
    return prisma_1.default.topicoPlantilla.create({
        data,
    });
};
exports.createTopicoPlantilla = createTopicoPlantilla;
const updateTopicoPlantilla = async (id, data) => {
    return prisma_1.default.topicoPlantilla.update({
        where: { id },
        data,
    });
};
exports.updateTopicoPlantilla = updateTopicoPlantilla;
const deleteTopicoPlantilla = async (id) => {
    return prisma_1.default.topicoPlantilla.update({
        where: { id },
        data: { activo: false },
    });
};
exports.deleteTopicoPlantilla = deleteTopicoPlantilla;
const getMaxOrden = async (id_unidad_plantilla) => {
    const result = await prisma_1.default.topicoPlantilla.findFirst({
        where: {
            id_unidad_plantilla,
            activo: true,
        },
        orderBy: {
            orden: 'desc',
        },
        select: {
            orden: true,
        },
    });
    return result?.orden ?? 0;
};
exports.getMaxOrden = getMaxOrden;
