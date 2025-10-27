"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneTopicosFromPlantillas = exports.deleteTopico = exports.updateTopico = exports.createTopico = exports.getTopicoById = exports.getTopicosByUnidad = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getTopicosByUnidad = async (id_unidad) => {
    return prisma_1.default.topico.findMany({
        where: {
            id_unidad
        }
    });
};
exports.getTopicosByUnidad = getTopicosByUnidad;
const getTopicoById = async (id) => {
    return prisma_1.default.topico.findUnique({
        where: { id },
        include: {
            unidad: true
        }
    });
};
exports.getTopicoById = getTopicoById;
const createTopico = async (data) => {
    return prisma_1.default.topico.create({
        data,
    });
};
exports.createTopico = createTopico;
const updateTopico = async (id, data) => {
    return prisma_1.default.topico.update({
        where: { id },
        data,
    });
};
exports.updateTopico = updateTopico;
const deleteTopico = async (id) => {
    return prisma_1.default.topico.update({
        where: { id },
        data: {
            activo: false
        }
    });
};
exports.deleteTopico = deleteTopico;
const cloneTopicosFromPlantillas = async (topicosPlantilla, unidadMap // { id_unidad_plantilla: id_unidad_clonada }
) => {
    if (!topicosPlantilla?.length)
        return [];
    const data = topicosPlantilla
        .map(t => {
        const id_unidad = unidadMap[t.id_unidad_plantilla];
        if (!id_unidad)
            return null;
        return {
            id_unidad,
            id_topico_plantilla: t.id,
            titulo: t.titulo,
            descripcion: t.descripcion,
            duracion_estimada: t.duracion_estimada,
            orden: t.orden,
            publicado: t.publicado,
            objetivos_aprendizaje: t.objetivos_aprendizaje,
            activo: true,
            fecha_creacion: new Date(),
        };
    })
        .filter((t) => t !== null);
    if (!data.length)
        return [];
    return prisma_1.default.topico.createMany({
        data,
    });
};
exports.cloneTopicosFromPlantillas = cloneTopicosFromPlantillas;
