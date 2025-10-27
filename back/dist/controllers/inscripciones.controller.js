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
exports.deleteInscripcion = exports.updateInscripcion = exports.createInscripcion = exports.getInscripcionStatus = exports.getInscripcion = exports.getInscripcionesByUsuario = exports.getInscrip = exports.getInscripcionesByEdicion = void 0;
const inscripcionService = __importStar(require("../services/inscripciones.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getInscripcionesByEdicion = async (req, res) => {
    try {
        const id_edicion = parseInt(req.params.id_edicion);
        const inscripciones = await inscripcionService.getInscripcionesByEdicion(id_edicion);
        return res.json(new apiResponse_1.ApiResponse(true, inscripciones));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener inscripciones';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getInscripcionesByEdicion = getInscripcionesByEdicion;
const getInscrip = async (req, res) => {
    try {
        const id_edicion = parseInt(req.params.id_edicion);
        const inscripciones = await inscripcionService.getInscripcionesByEdicion(id_edicion);
        return res.json(new apiResponse_1.ApiResponse(true, inscripciones));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener inscripciones';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getInscrip = getInscrip;
const getInscripcionesByUsuario = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        const inscripciones = await inscripcionService.getInscripcionesByUsuario(id_usuario);
        return res.json(new apiResponse_1.ApiResponse(true, inscripciones));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener inscripciones';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getInscripcionesByUsuario = getInscripcionesByUsuario;
const getInscripcion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const inscripcion = await inscripcionService.getInscripcion(id);
        return res.json(new apiResponse_1.ApiResponse(true, inscripcion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener la inscripción';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getInscripcion = getInscripcion;
const getInscripcionStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_edicion = parseInt(req.params.id_edicion);
        const inscripcion = await inscripcionService.getInscripcionStatus(id, id_edicion);
        return res.json(new apiResponse_1.ApiResponse(true, inscripcion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener la inscripción';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getInscripcionStatus = getInscripcionStatus;
const createInscripcion = async (req, res) => {
    try {
        const data = req.body;
        const nuevaInscripcion = await inscripcionService.createInscripcion(data);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, nuevaInscripcion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear la inscripción';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createInscripcion = createInscripcion;
const updateInscripcion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedInscripcion = await inscripcionService.updateInscripcion(id, data);
        return res.json(new apiResponse_1.ApiResponse(true, updatedInscripcion));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar la inscripción';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateInscripcion = updateInscripcion;
const deleteInscripcion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await inscripcionService.deleteInscripcion(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Inscripción eliminada correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar la inscripción';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteInscripcion = deleteInscripcion;
