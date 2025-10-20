"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnidadPlantilla = exports.updateUnidadPlantilla = exports.createUnidadPlantilla = exports.getUnidadPlantillaById = exports.getUnidadesPlantillaPublicadasByCurso = exports.getUnidadesPlantillaByCurso = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUnidadesPlantillaByCurso = async (id) => {
    return prisma_1.default.unidadPlantilla.findMany({
        where: {
            id_curso: id
        }
    });
};
exports.getUnidadesPlantillaByCurso = getUnidadesPlantillaByCurso;
const getUnidadesPlantillaPublicadasByCurso = async (id) => {
    return prisma_1.default.unidadPlantilla.findMany({
        where: {
            id_curso: id,
            activo: true,
        }
    });
};
exports.getUnidadesPlantillaPublicadasByCurso = getUnidadesPlantillaPublicadasByCurso;
const getUnidadPlantillaById = async (id) => {
    return prisma_1.default.unidadPlantilla.findUnique({
        where: { id },
        include: {
            curso: true
        }
    });
};
exports.getUnidadPlantillaById = getUnidadPlantillaById;
const createUnidadPlantilla = async (data) => {
    const mappedData = {
        id_curso: data.id_curso,
        titulo: data.titulo,
        descripcion: data.descripcion ?? null,
        orden: data.orden,
        version: data.version ?? 1,
        icono: data.icono ?? null,
        color: data.color ?? null,
        activo: data.activo ?? true
    };
    return prisma_1.default.unidadPlantilla.create({
        data: mappedData,
    });
};
exports.createUnidadPlantilla = createUnidadPlantilla;
const updateUnidadPlantilla = async (id, data) => {
    return prisma_1.default.unidadPlantilla.update({
        where: { id },
        data,
    });
};
exports.updateUnidadPlantilla = updateUnidadPlantilla;
const deleteUnidadPlantilla = async (id) => {
    return prisma_1.default.unidadPlantilla.update({
        where: { id },
        data: {
            activo: false
        }
    });
};
exports.deleteUnidadPlantilla = deleteUnidadPlantilla;
