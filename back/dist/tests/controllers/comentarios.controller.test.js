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
const comentarioController = __importStar(require("../../controllers/comentarios.controller"));
const comentarioService = __importStar(require("../../services/comentarios.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("@/utils/apiResponse");
jest.mock('../../services/comentarios.service');
describe('Comentarios Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // =========================================================================
    // CREACIÓN DE COMENTARIO  (C1 - C7)
    // =========================================================================
    describe('createComentario', () => {
        const baseData = {
            id_topico: 1,
            id_usuario: 5,
            texto: 'Buen aporte'
        };
        it('C1: Creación exitosa (201)', async () => {
            const mockComentario = {
                ...baseData,
                visto: false,
                fecha_publicacion: new Date().toISOString()
            };
            comentarioService.createComentario
                .mockResolvedValue(mockComentario);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockComentario));
        });
        it('C2: No se puede publicar comentarios vacíos (400)', async () => {
            const error = { status: 400, message: 'No se puede publicar comentarios vacios' };
            comentarioService.createComentario
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)({ ...baseData, texto: '' });
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'No se puede publicar comentarios vacios'));
        });
        it('C3: Falta id_topico (400)', async () => {
            const error = { status: 400, message: 'El topico es obligatorio' };
            comentarioService.createComentario
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)({ ...baseData, id_topico: null });
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El topico es obligatorio'));
        });
        it('C4: Falta id_usuario (400)', async () => {
            const error = { status: 400, message: 'Usuario no reconocido' };
            comentarioService.createComentario
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)({ ...baseData, id_usuario: null });
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no reconocido'));
        });
        it('C5: Topico no encontrado (404)', async () => {
            const error = { status: 404, message: 'Topico no encontrado' };
            comentarioService.createComentario
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Topico no encontrado'));
        });
        it('C6: Usuario no encontrado (404)', async () => {
            const error = { status: 404, message: 'Usuario no encontrado' };
            comentarioService.createComentario
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
        it('C7: Error interno (500)', async () => {
            comentarioService.createComentario
                .mockRejectedValue(new Error('Error al crear comentario'));
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.createComentario(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al crear comentario'));
        });
    });
    // =========================================================================
    // GET COMENTARIOS BY TOPICO  (C8 - C13)
    // =========================================================================
    describe('getComentariosByTopico', () => {
        const baseReq = {
            id_topico: 1,
            id_usuario: 10
        };
        it('C8: Listar comentarios exitosamente (200)', async () => {
            const mockComentarios = [
                { id_topico: 1, id_usuario: 2, texto: 'Muy buen aporte', visto: false, fecha_publicacion: '2025-11-10T12:00:00Z' }
            ];
            comentarioService.getComentariosByTopico
                .mockResolvedValue(mockComentarios);
            const req = (0, setup_1.createMockRequest)(baseReq);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockComentarios));
        });
        it('C9: Falta id_topico (400)', async () => {
            const error = { status: 400, message: 'El topico es obligatorio' };
            comentarioService.getComentariosByTopico
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)({ id_usuario: 10 });
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El topico es obligatorio'));
        });
        it('C10: Falta id_usuario (400)', async () => {
            const error = { status: 400, message: 'Usuario no reconocido' };
            comentarioService.getComentariosByTopico
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)({ id_topico: 1 });
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no reconocido'));
        });
        it('C11: Topico no encontrado (404)', async () => {
            const error = { status: 404, message: 'Topico no encontrado' };
            comentarioService.getComentariosByTopico
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)(baseReq);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Topico no encontrado'));
        });
        it('C12: Usuario no encontrado (404)', async () => {
            const error = { status: 404, message: 'Usuario no encontrado' };
            comentarioService.getComentariosByTopico
                .mockRejectedValue(error);
            const req = (0, setup_1.createMockRequest)(baseReq);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        });
        it('C13: Sin comentarios (200)', async () => {
            comentarioService.getComentariosByTopico
                .mockResolvedValue([]);
            const req = (0, setup_1.createMockRequest)(baseReq);
            const res = (0, setup_1.createMockResponse)();
            await comentarioController.getComentariosByTopico(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, []));
        });
    });
});
