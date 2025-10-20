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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicosByUnidadPlantilla = getTopicosByUnidadPlantilla;
exports.createTopicoPlantilla = createTopicoPlantilla;
exports.updateTopicoPlantilla = updateTopicoPlantilla;
exports.deleteTopicoPlantilla = deleteTopicoPlantilla;
const apiResponse_1 = require("../utils/apiResponse");
const topicos_plantilla_repository_1 = __importDefault(require("../repositories/topicos.plantilla.repository"));
const unidadesPlantillaRepository = __importStar(require("../repositories/unidades.plantilla.repository"));
async function getTopicosByUnidadPlantilla(req, res) {
    try {
        const id_unidad_plantilla = parseInt(req.params.id_unidad_plantilla);
        const unidadPlantilla = await unidadesPlantillaRepository.getUnidadPlantillaById(id_unidad_plantilla);
        if (!unidadPlantilla) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        }
        const topicos = await topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla(id_unidad_plantilla);
        return res.json(new apiResponse_1.ApiResponse(true, topicos));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener los tópicos'));
    }
}
async function createTopicoPlantilla(req, res) {
    try {
        const id_unidad_plantilla = parseInt(req.params.id_unidad_plantilla);
        const { titulo, descripcion, duracion_estimada, objetivos_aprendizaje } = req.body;
        // Validaciones
        if (!titulo || !duracion_estimada) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        }
        if (duracion_estimada <= 0) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'La duración estimada debe ser mayor a 0'));
        }
        // Verificar que la unidad plantilla existe
        const unidadPlantilla = await unidadesPlantillaRepository.getUnidadPlantillaById(id_unidad_plantilla);
        if (!unidadPlantilla) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        }
        // Obtener el orden máximo actual
        const maxOrden = await topicos_plantilla_repository_1.default.getMaxOrden(id_unidad_plantilla);
        const newTopico = await topicos_plantilla_repository_1.default.createTopicoPlantilla({
            id_unidad_plantilla,
            titulo,
            descripcion,
            duracion_estimada,
            orden: maxOrden + 1,
            version: 1,
            objetivos_aprendizaje,
            activo: true,
        });
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newTopico));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al crear el tópico'));
    }
}
async function updateTopicoPlantilla(req, res) {
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
        const topicoExistente = await topicos_plantilla_repository_1.default.getTopicoPlantillaById(id);
        if (!topicoExistente) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        }
        const updatedTopico = await topicos_plantilla_repository_1.default.updateTopicoPlantilla(id, {
            titulo,
            descripcion,
            duracion_estimada,
            orden,
            version: topicoExistente.version + 1,
            publicado,
            objetivos_aprendizaje,
        });
        return res.json(new apiResponse_1.ApiResponse(true, updatedTopico));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al actualizar el tópico'));
    }
}
async function deleteTopicoPlantilla(req, res) {
    try {
        const idStr = req.params.id;
        if (!idStr || isNaN(Number(idStr))) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'ID de tópico inválido'));
        }
        const id = parseInt(idStr);
        const topicoExistente = await topicos_plantilla_repository_1.default.getTopicoPlantillaById(id);
        if (!topicoExistente) {
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        }
        const deletedTopico = await topicos_plantilla_repository_1.default.deleteTopicoPlantilla(id);
        return res.json(new apiResponse_1.ApiResponse(true, deletedTopico, 'Tópico plantilla eliminado correctamente'));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al eliminar el tópico'));
    }
}
