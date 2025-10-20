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
exports.deleteUnidadPlantilla = exports.updateUnidadPlantilla = exports.createUnidadPlantilla = exports.getUnidadPlantilla = exports.getUnidadesPlantilla = void 0;
const unidadPlantillaService = __importStar(require("../services/unidades.plantilla.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getUnidadesPlantilla = async (req, res) => {
    try {
        const id_curso = parseInt(req.params.id_curso);
        const unidades = await unidadPlantillaService.getUnidadesPlantilla(id_curso);
        return res.json(new apiResponse_1.ApiResponse(true, unidades));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener unidades plantilla';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getUnidadesPlantilla = getUnidadesPlantilla;
const getUnidadPlantilla = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const unidad = await unidadPlantillaService.getUnidadPlantilla(id);
        return res.json(new apiResponse_1.ApiResponse(true, unidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener unidad plantilla';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getUnidadPlantilla = getUnidadPlantilla;
const createUnidadPlantilla = async (req, res) => {
    try {
        const data = req.body;
        const newUnidad = await unidadPlantillaService.createUnidadPlantilla(data);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newUnidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear unidad plantilla';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createUnidadPlantilla = createUnidadPlantilla;
const updateUnidadPlantilla = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedUnidad = await unidadPlantillaService.updateUnidadPlantilla(id, data);
        return res.json(new apiResponse_1.ApiResponse(true, updatedUnidad));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar unidad plantilla';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateUnidadPlantilla = updateUnidadPlantilla;
const deleteUnidadPlantilla = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await unidadPlantillaService.deleteUnidadPlantilla(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Unidad plantilla eliminada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar unidad plantilla';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteUnidadPlantilla = deleteUnidadPlantilla;
