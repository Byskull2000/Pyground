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
exports.createComentario = exports.getComentariosByTopico = void 0;
const comentariosRepository = __importStar(require("../repositories/comentarios.repository"));
const usuariosRepository = __importStar(require("../repositories/usuarios.repository"));
const topicosRepository = __importStar(require("../repositories/topicos.repository"));
const getComentariosByTopico = async (data) => {
    if (!data.id_topico)
        throw { status: 400, message: 'El topico es obligatorio' };
    if (!data.id_usuario)
        throw { status: 400, message: 'Usuario no reconocido' };
    if (await topicosRepository.getTopicoById(data.id_topico) == null)
        throw { status: 404, message: 'Topico no encontrado' };
    if (await usuariosRepository.getUsuarioById(data.id_usuario) == null)
        throw { status: 404, message: 'Usuario no encontrado' };
    return await comentariosRepository.getComentariosByTopico(data);
};
exports.getComentariosByTopico = getComentariosByTopico;
const createComentario = async (data) => {
    if (!data.texto)
        throw { status: 400, message: 'No se puede publicar comentarios vacios' };
    if (!data.id_topico)
        throw { status: 400, message: 'El topico es obligatorio' };
    if (!data.id_usuario)
        throw { status: 400, message: 'Usuario no reconocido' };
    if (await topicosRepository.getTopicoById(data.id_topico) == null)
        throw { status: 404, message: 'Topico no encontrado' };
    if (await usuariosRepository.getUsuarioById(data.id_usuario) == null)
        throw { status: 404, message: 'Usuario no encontrado' };
    if (!data.texto || !data.id_topico || !data.id_usuario) {
        throw new Error('Faltan datos obligatorios para crear el comentario');
    }
    return await comentariosRepository.createComentario(data);
};
exports.createComentario = createComentario;
