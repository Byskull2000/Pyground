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
const cursoController = __importStar(require("../../controllers/cursos.controller"));
const cursoService = __importStar(require("../../services/cursos.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("@/utils/apiResponse");
jest.mock('../../services/cursos.service');
describe('Cursos Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getCursos', () => {
        it('debe retornar lista de cursos con status 200', async () => {
            const mockCursos = [
                {
                    id: 1,
                    nombre: 'Python',
                    codigo_curso: 'PYT001',
                    descripcion: null,
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: null
                },
                {
                    id: 2,
                    nombre: 'Java',
                    codigo_curso: 'JAV002',
                    descripcion: null,
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: null
                }
            ];
            cursoService.getCursos.mockResolvedValue(mockCursos);
            const req = (0, setup_1.createMockRequest)();
            const res = (0, setup_1.createMockResponse)();
            await cursoController.getCursos(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockCursos));
            expect(cursoService.getCursos).toHaveBeenCalled();
        });
        it('debe retornar error 500 cuando falla el servicio', async () => {
            cursoService.getCursos.mockRejectedValue(new Error('Service error'));
            const req = (0, setup_1.createMockRequest)();
            const res = (0, setup_1.createMockResponse)();
            await cursoController.getCursos(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener cursos'));
        });
    });
    describe('getCursoById', () => {
        it('debe retornar un curso por id existente (VC1)', async () => {
            const mockCurso = {
                id: 1,
                nombre: 'JAVA',
                codigo_curso: 'JAV001',
                descripcion: null,
                activo: true,
                fecha_creacion: new Date(),
                creado_por: null
            };
            cursoService.getCursoById.mockResolvedValue(mockCurso);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.getCursoById(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockCurso));
            expect(cursoService.getCursoById).toHaveBeenCalledWith(1);
        });
        it('debe retornar 404 si el curso no existe (VC2)', async () => {
            cursoService.getCursoById.mockResolvedValue(null);
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.getCursoById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        });
        it('debe retornar 500 si hay error del servidor (VC5)', async () => {
            cursoService.getCursoById.mockRejectedValue(new Error('Database error'));
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.getCursoById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener curso'));
        });
    });
    describe('publicateCurso', () => {
        it('PC1 - debe publicar un curso correctamente', async () => {
            cursoService.publicateCurso.mockResolvedValue({});
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.publicateCurso(req, res);
            expect(cursoService.publicateCurso).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Curso publicado correctamente' }));
        });
        it('PC2 - debe retornar 404 si el curso no existe', async () => {
            cursoService.publicateCurso.mockRejectedValue({
                status: 404,
                message: 'Curso no encontrado',
            });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.publicateCurso(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        });
        it('PC3 - debe retornar 500 si ocurre un error inesperado', async () => {
            cursoService.publicateCurso.mockRejectedValue(new Error('Error inesperado'));
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.publicateCurso(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error inesperado'));
        });
    });
    describe('deactivateCurso', () => {
        it('DC1 - debe archivar un curso correctamente', async () => {
            cursoService.deactivateCurso.mockResolvedValue({});
            const req = (0, setup_1.createMockRequest)({}, { id: '2' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.deactivateCurso(req, res);
            expect(cursoService.deactivateCurso).toHaveBeenCalledWith(2);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Curso archivado' }));
        });
        it('DC2 - debe retornar 404 si el curso no existe', async () => {
            cursoService.deactivateCurso.mockRejectedValue({
                status: 404,
                message: 'Curso no encontrado',
            });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.deactivateCurso(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        });
        it('DC3 - debe retornar 500 si ocurre un error inesperado', async () => {
            cursoService.deactivateCurso.mockRejectedValue(new Error('Error inesperado'));
            const req = (0, setup_1.createMockRequest)({}, { id: '3' });
            const res = (0, setup_1.createMockResponse)();
            await cursoController.deactivateCurso(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error inesperado'));
        });
    });
});
