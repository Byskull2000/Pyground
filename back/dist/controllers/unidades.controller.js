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
exports.deactivateUnidad = exports.publicateUnidad = exports.restoreUnidad = exports.deleteUnidad = exports.updateUnidad = exports.createUnidad = exports.getUnidad = exports.getUnidadesByEdicion = void 0;
const unidadService = __importStar(require("../services/unidades.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getUnidadesByEdicion = async (req, res) => {
    try {
        const id_edicion = parseInt(req.params.id_edicion);
        const unidades = await unidadService.getUnidadesByEdicion(id_edicion);
        return res.json(new apiResponse_1.ApiResponse(true, unidades));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener unidades';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getUnidadesByEdicion = getUnidadesByEdicion;
const getUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const unidad = await unidadService.getUnidad(id);
        return res.json(new apiResponse_1.ApiResponse(true, unidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getUnidad = getUnidad;
const createUnidad = async (req, res) => {
    try {
        const data = req.body;
        const newUnidad = await unidadService.createUnidad(data);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newUnidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createUnidad = createUnidad;
const updateUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedUnidad = await unidadService.updateUnidad(id, data);
        return res.json(new apiResponse_1.ApiResponse(true, updatedUnidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateUnidad = updateUnidad;
const deleteUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await unidadService.deleteUnidad(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Unidad eliminada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteUnidad = deleteUnidad;
const restoreUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await unidadService.restoreUnidad(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Unidad restaurada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al restaurar unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.restoreUnidad = restoreUnidad;
const publicateUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await unidadService.publicateUnidad(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Unidad publicada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al publicar unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.publicateUnidad = publicateUnidad;
const deactivateUnidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await unidadService.deactivateUnidad(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Unidad archivada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al archivar unidad';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deactivateUnidad = deactivateUnidad;
