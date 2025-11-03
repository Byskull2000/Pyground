"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderContenidos = exports.deleteContenido = exports.updateContenido = exports.createContenidos = exports.getContenidoById = exports.getContenidosByTopico = void 0;
const contenidosRepo = __importStar(require("../repositories/contenidos.repository"));
const topicosRepo = __importStar(require("../repositories/topicos.repository"));
const getContenidosByTopico = async (id_topico) => {
    const topico = await topicosRepo.getTopicoById(id_topico);
    if (!topico)
        throw { status: 404, message: 'Tópico no encontrado' };
    return contenidosRepo.getContenidosByTopico(id_topico);
};
exports.getContenidosByTopico = getContenidosByTopico;
const getContenidoById = async (id) => {
    const contenido = await contenidosRepo.getContenidoById(id);
    if (!contenido)
        throw { status: 404, message: 'Contenido no encontrado' };
    return contenido;
};
exports.getContenidoById = getContenidoById;
const createContenidos = async (id_topico, contenidos) => {
    if (!id_topico)
        throw { status: 400, message: 'El id_topico es obligatorio' };
    if (!contenidos || contenidos.length === 0)
        throw { status: 400, message: 'Debe incluir al menos un contenido' };
    const topico = await topicosRepo.getTopicoById(id_topico);
    if (!topico)
        throw { status: 404, message: 'Tópico no encontrado' };
    return contenidosRepo.createContenidos({ id_topico, contenidos });
};
exports.createContenidos = createContenidos;
const updateContenido = async (id, data) => {
    const contenido = await contenidosRepo.getContenidoById(id);
    if (!contenido)
        throw { status: 404, message: 'Contenido no encontrado' };
    return contenidosRepo.updateContenido(id, data);
};
exports.updateContenido = updateContenido;
const deleteContenido = async (id) => {
    const contenido = await contenidosRepo.getContenidoById(id);
    if (!contenido)
        throw { status: 404, message: 'Contenido no encontrado' };
    if (!contenido.activo)
        throw { status: 400, message: 'El contenido ya está inactivo' };
    return contenidosRepo.deleteContenido(id);
};
exports.deleteContenido = deleteContenido;
const reorderContenidos = async (contenidos) => {
    if (!contenidos || contenidos.length === 0)
        throw { status: 400, message: 'Debe enviar al menos un contenido para reordenar' };
    for (const u of contenidos) {
        if (!u.id || u.orden === undefined)
            throw { status: 400, message: 'Cada contenido debe tener id y orden válidos' };
    }
    const ids = contenidos.map(u => u.id);
    const existentes = await contenidosRepo.existContenidosByIds(ids);
    if (existentes.length !== ids.length)
        throw { status: 404, message: 'Uno o más contenidos no existen' };
    const result = await contenidosRepo.reorderContenidos(contenidos);
    return { message: 'Contenidos reordenados correctamente', count: result.length };
};
exports.reorderContenidos = reorderContenidos;
