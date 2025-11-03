"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existContenidosByIds = exports.reorderContenidos = exports.deleteContenido = exports.updateContenido = exports.getContenidoById = exports.getContenidosByTopico = exports.createContenidos = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createContenidos = async (data) => {
    return prisma_1.default.contenido.createMany({
        data: data.contenidos.map(c => ({
            id_topico: data.id_topico,
            tipo: c.tipo,
            orden: c.orden,
            titulo: c.titulo,
            descripcion: c.descripcion,
            texto: c.texto,
            enlace_archivo: c.enlace_archivo,
        })),
    });
};
exports.createContenidos = createContenidos;
const getContenidosByTopico = async (id_topico) => {
    return prisma_1.default.contenido.findMany({
        where: { id_topico, activo: true },
        orderBy: { orden: 'asc' },
    });
};
exports.getContenidosByTopico = getContenidosByTopico;
const getContenidoById = async (id) => {
    return prisma_1.default.contenido.findUnique({
        where: { id },
    });
};
exports.getContenidoById = getContenidoById;
const updateContenido = async (id, data) => {
    return prisma_1.default.contenido.update({
        where: { id },
        data,
    });
};
exports.updateContenido = updateContenido;
const deleteContenido = async (id) => {
    return prisma_1.default.contenido.update({
        where: { id },
        data: { activo: false },
    });
};
exports.deleteContenido = deleteContenido;
const reorderContenidos = async (contenidos) => {
    return prisma_1.default.$transaction(contenidos.map(u => prisma_1.default.contenido.update({
        where: { id: u.id },
        data: { orden: u.orden, fecha_actualizacion: new Date() },
    })));
};
exports.reorderContenidos = reorderContenidos;
const existContenidosByIds = async (ids) => {
    const encontrados = await prisma_1.default.contenido.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });
    return encontrados.map(u => u.id);
};
exports.existContenidosByIds = existContenidosByIds;
