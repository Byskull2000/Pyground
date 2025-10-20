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
exports.deleteEdicion = exports.updateEdicion = exports.createEdicion = exports.getEdicion = exports.getEdicionesByCurso = void 0;
const edicionService = __importStar(require("../services/ediciones.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getEdicionesByCurso = async (req, res) => {
    try {
        const id_curso = parseInt(req.params.id_curso);
        const ediciones = await edicionService.getEdicionesByCurso(id_curso);
        return res.json(new apiResponse_1.ApiResponse(true, ediciones));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener ediciones';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getEdicionesByCurso = getEdicionesByCurso;
const getEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const edicion = await edicionService.getEdicion(id);
        return res.json(new apiResponse_1.ApiResponse(true, edicion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener la edición';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getEdicion = getEdicion;
const createEdicion = async (req, res) => {
    try {
        const data = req.body;
        const newEdicion = await edicionService.createEdicion(data);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newEdicion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear la edición';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createEdicion = createEdicion;
const updateEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedEdicion = await edicionService.updateEdicion(id, data);
        return res.json(new apiResponse_1.ApiResponse(true, updatedEdicion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar la edición';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateEdicion = updateEdicion;
const deleteEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await edicionService.deleteEdicion(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Edición eliminada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar la edición';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteEdicion = deleteEdicion;
