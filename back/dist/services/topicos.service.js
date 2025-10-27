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
exports.deleteTopico = exports.updateTopico = exports.createTopico = exports.getTopicoById = exports.getTopicosByUnidad = void 0;
const topicosRepository = __importStar(require("../repositories/topicos.repository"));
const getTopicosByUnidad = async (id_unidad) => {
    return await topicosRepository.getTopicosByUnidad(id_unidad);
};
exports.getTopicosByUnidad = getTopicosByUnidad;
const getTopicoById = async (id) => {
    const topico = await topicosRepository.getTopicoById(id);
    if (!topico) {
        throw new Error('Tópico no encontrado');
    }
    return topico;
};
exports.getTopicoById = getTopicoById;
const createTopico = async (data) => {
    // Obtener el siguiente orden si no se proporciona
    if (data.orden === undefined) {
        const topicos = await topicosRepository.getTopicosByUnidad(data.id_unidad);
        const maxOrden = topicos.length > 0 ? Math.max(...topicos.map(t => t.orden)) : 0;
        data.orden = maxOrden + 1;
    }
    const topicoData = {
        id_unidad: data.id_unidad,
        titulo: data.titulo,
        descripcion: data.descripcion,
        duracion_estimada: data.duracion_estimada,
        orden: data.orden,
        publicado: data.publicado || false,
        objetivos_aprendizaje: data.objetivos_aprendizaje,
        activo: true,
        id_topico_plantilla: data.id_topico_plantilla,
    };
    return await topicosRepository.createTopico(topicoData);
};
exports.createTopico = createTopico;
const updateTopico = async (id, data) => {
    // Verificar que el tópico existe
    const topicoExistente = await topicosRepository.getTopicoById(id);
    if (!topicoExistente) {
        throw new Error('Tópico no encontrado');
    }
    return await topicosRepository.updateTopico(id, {
        ...data,
        fecha_actualizacion: new Date(),
    });
};
exports.updateTopico = updateTopico;
const deleteTopico = async (id) => {
    // Verificar que el tópico existe
    const topicoExistente = await topicosRepository.getTopicoById(id);
    if (!topicoExistente) {
        throw new Error('Tópico no encontrado');
    }
    // Verificar que esté activo
    if (!topicoExistente.activo) {
        throw new Error('El tópico ya está inactivo');
    }
    return await topicosRepository.deleteTopico(id);
};
exports.deleteTopico = deleteTopico;
