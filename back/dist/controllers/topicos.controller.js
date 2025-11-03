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
exports.reorderTopicos = void 0;
exports.getTopicosByUnidad = getTopicosByUnidad;
exports.getTopicoById = getTopicoById;
exports.createTopico = createTopico;
exports.updateTopico = updateTopico;
exports.deleteTopico = deleteTopico;
const apiResponse_1 = require("../utils/apiResponse");
const topicosService = __importStar(require("../services/topicos.service"));
const unidadesRepository = __importStar(require("../repositories/unidades.repository"));
async function getTopicosByUnidad(req, res) {
    try {
        const id_unidad = parseInt(req.params.id_unidad);
        const unidad = await unidadesRepository.getUnidadById(id_unidad);
        if (!unidad) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        }
        const topicos = await topicosService.getTopicosByUnidad(id_unidad);
        return res.json(new apiResponse_1.ApiResponse(true, topicos));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener los tópicos'));
    }
}
async function getTopicoById(req, res) {
    try {
        const idStr = req.params.id;
        if (!idStr || isNaN(Number(idStr))) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'ID de tópico inválido'));
        }
        const id = parseInt(idStr);
        const topico = await topicosService.getTopicoById(id);
        return res.json(new apiResponse_1.ApiResponse(true, topico));
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error && err.message === 'Tópico no encontrado') {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, err.message));
        }
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener el tópico'));
    }
}
async function createTopico(req, res) {
    try {
        const id_unidad = parseInt(req.params.id_unidad);
        const { titulo, descripcion, duracion_estimada, orden, publicado, objetivos_aprendizaje, id_topico_plantilla } = req.body;
        // Validaciones
        if (!titulo || !duracion_estimada) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        }
        if (duracion_estimada <= 0) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'La duración estimada debe ser mayor a 0'));
        }
        // Verificar que la unidad existe
        const unidad = await unidadesRepository.getUnidadById(id_unidad);
        if (!unidad) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        }
        const newTopico = await topicosService.createTopico({
            id_unidad,
            titulo,
            descripcion,
            duracion_estimada,
            orden,
            publicado,
            objetivos_aprendizaje,
            id_topico_plantilla,
        });
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newTopico));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al crear el tópico'));
    }
}
async function updateTopico(req, res) {
    try {
        const idStr = req.params.id;
        if (!idStr || isNaN(Number(idStr))) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'ID de tópico inválido'));
        }
        const id = parseInt(idStr);
        const { titulo, descripcion, duracion_estimada, orden, publicado, objetivos_aprendizaje } = req.body;
        if (!titulo && !descripcion && duracion_estimada === undefined &&
            orden === undefined && publicado === undefined && !objetivos_aprendizaje) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'No hay datos para actualizar'));
        }
        const updatedTopico = await topicosService.updateTopico(id, {
            titulo,
            descripcion,
            duracion_estimada,
            orden,
            publicado,
            objetivos_aprendizaje,
        });
        return res.json(new apiResponse_1.ApiResponse(true, updatedTopico));
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error && err.message === 'Tópico no encontrado') {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, err.message));
        }
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al actualizar el tópico'));
    }
}
async function deleteTopico(req, res) {
    try {
        const idStr = req.params.id;
        if (!idStr || isNaN(Number(idStr))) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'ID de tópico inválido'));
        }
        const id = parseInt(idStr);
        const deletedTopico = await topicosService.deleteTopico(id);
        return res.json(new apiResponse_1.ApiResponse(true, deletedTopico, 'Tópico eliminado correctamente'));
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error && err.message.includes('no encontrado')) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, err.message));
        }
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al eliminar el tópico'));
    }
}
const reorderTopicos = async (req, res) => {
    try {
        const topicos = req.body;
        const result = await topicosService.reorderTopicos(topicos);
        return res.json(new apiResponse_1.ApiResponse(true, result, 'Topicos reordenados correctamente'));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al reordenar topicos';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.reorderTopicos = reorderTopicos;
