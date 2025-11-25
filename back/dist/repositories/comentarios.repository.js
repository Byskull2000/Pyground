"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComentario = exports.getComentarioById = exports.getComentariosByTopico = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getComentariosByTopico = async (request) => {
    const { id_topico, id_usuario } = request;
    const comentarios = await prisma_1.default.comentario.findMany({
        where: { id_topico },
        orderBy: { fecha_publicacion: 'asc' },
        include: {
            vistos: {
                where: { id_usuario },
                select: { fue_visto: true },
            },
        },
    });
    const idsComentarios = comentarios.map(c => c.id);
    const vistasExistentes = await prisma_1.default.visto.findMany({
        where: {
            id_usuario,
            id_comentario: { in: idsComentarios },
        },
        select: { id_comentario: true },
    });
    const idsYaVistos = vistasExistentes.map(v => v.id_comentario);
    const idsNoVistos = idsComentarios.filter(id => !idsYaVistos.includes(id));
    if (idsNoVistos.length > 0) {
        await prisma_1.default.visto.createMany({
            data: idsNoVistos.map(id_comentario => ({
                id_usuario,
                id_comentario,
                fue_visto: true,
            })),
        });
    }
    return comentarios.map(c => mapToComentarioResponse(c, c.vistos.length > 0));
};
exports.getComentariosByTopico = getComentariosByTopico;
const getComentarioById = async (id, id_usuario) => {
    const comentario = await prisma_1.default.comentario.findUnique({
        where: { id },
        include: {
            vistos: {
                where: { id_usuario },
                select: { fue_visto: true },
            },
        },
    });
    if (!comentario)
        return null;
    if (comentario.vistos.length === 0) {
        await prisma_1.default.visto.create({
            data: {
                id_comentario: comentario.id,
                id_usuario,
                fue_visto: true,
            },
        });
    }
    return mapToComentarioResponse(comentario, comentario.vistos.length > 0);
};
exports.getComentarioById = getComentarioById;
const createComentario = async (data) => {
    const comentario = await prisma_1.default.comentario.create({ data });
    return mapToComentarioResponse(comentario, false);
};
exports.createComentario = createComentario;
const mapToComentarioResponse = (comentario, visto) => ({
    id_topico: comentario.id_topico,
    id_usuario: comentario.id_usuario,
    texto: comentario.texto,
    visto,
    fecha_publicacion: comentario.fecha_publicacion.toISOString(),
});
