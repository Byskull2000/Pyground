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
exports.deactivateCurso = exports.publicateCurso = exports.getCursoById = exports.getCursos = void 0;
const cursoService = __importStar(require("../services/cursos.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getCursos = async (_req, res) => {
    try {
        const cursos = await cursoService.getCursos();
        res.json(new apiResponse_1.ApiResponse(true, cursos));
    }
    catch (err) {
        const status = err?.status ?? 500;
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener cursos'));
    }
};
exports.getCursos = getCursos;
const getCursoById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const curso = await cursoService.getCursoById(id);
        if (!curso)
            return res
                .status(404)
                .json(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        res.json(new apiResponse_1.ApiResponse(true, curso));
    }
    catch (err) {
        const status = err?.status ?? 500;
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener curso'));
    }
};
exports.getCursoById = getCursoById;
const publicateCurso = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await cursoService.publicateCurso(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Curso publicado correctamente' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al publicar el curso';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.publicateCurso = publicateCurso;
const deactivateCurso = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await cursoService.deactivateCurso(id);
        return res.json(new apiResponse_1.ApiResponse(true, { message: 'Curso archivado' }));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al archivar curso';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deactivateCurso = deactivateCurso;
