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
exports.uploadSingleFile = exports.uploadMultipleFiles = exports.reorderContenidos = exports.deleteContenido = exports.updateContenido = exports.createContenidos = exports.getContenidoById = exports.getContenidosByTopico = void 0;
const contenidosService = __importStar(require("../services/contenidos.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getContenidosByTopico = async (req, res) => {
    try {
        const id_topico = parseInt(req.params.id_topico);
        const contenidos = await contenidosService.getContenidosByTopico(id_topico);
        return res.json(new apiResponse_1.ApiResponse(true, contenidos));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener contenidos';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getContenidosByTopico = getContenidosByTopico;
const getContenidoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const contenido = await contenidosService.getContenidoById(id);
        return res.json(new apiResponse_1.ApiResponse(true, contenido));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener el contenido';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getContenidoById = getContenidoById;
const createContenidos = async (req, res) => {
    try {
        const id_topico = parseInt(req.body.id_topico);
        const contenidos = req.body.contenidos;
        const newContenidos = await contenidosService.createContenidos(id_topico, contenidos);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newContenidos, 'Contenido(s) creado(s) correctamente'));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear contenido';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createContenidos = createContenidos;
const updateContenido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedContenido = await contenidosService.updateContenido(id, data);
        return res.json(new apiResponse_1.ApiResponse(true, updatedContenido, 'Contenido actualizado correctamente'));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar contenido';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateContenido = updateContenido;
const deleteContenido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedContenido = await contenidosService.deleteContenido(id);
        return res.json(new apiResponse_1.ApiResponse(true, deletedContenido, 'Contenido eliminado correctamente'));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar contenido';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteContenido = deleteContenido;
const reorderContenidos = async (req, res) => {
    try {
        const contenidos = req.body;
        const result = await contenidosService.reorderContenidos(contenidos);
        return res.json(new apiResponse_1.ApiResponse(true, result, 'Contenidos reordenados correctamente'));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al reordenar contenidos';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.reorderContenidos = reorderContenidos;
const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'No se encontraron archivos'));
        }
        const files = req.files;
        const fileUrls = files.map(file => `/uploads/${file.filename}`);
        return res.json(new apiResponse_1.ApiResponse(true, { urls: fileUrls }, 'Archivos subidos correctamente'));
    }
    catch (err) {
        console.error(err);
        const message = err?.message ?? 'Error al subir archivos';
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.uploadMultipleFiles = uploadMultipleFiles;
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(new apiResponse_1.ApiResponse(false, null, 'No se encontró el archivo'));
        }
        const file = req.file;
        const fileUrl = `/uploads/${file.filename}`;
        return res.json(new apiResponse_1.ApiResponse(true, { url: fileUrl }, 'Archivo subido correctamente'));
    }
    catch (err) {
        console.error(err);
        const message = err?.message ?? 'Error al subir archivo';
        return res.status(500).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.uploadSingleFile = uploadSingleFile;
