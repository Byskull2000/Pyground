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
const contenidosController = __importStar(require("../../controllers/contenidos.controller"));
const contenidosService = __importStar(require("../../services/contenidos.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
jest.mock('../../services/contenidos.service');
var TipoContenidoEnum;
(function (TipoContenidoEnum) {
    TipoContenidoEnum["TEXTO"] = "TEXTO";
    TipoContenidoEnum["IMAGEN"] = "IMAGEN";
    TipoContenidoEnum["VIDEO"] = "VIDEO";
    TipoContenidoEnum["AUDIO"] = "AUDIO";
    TipoContenidoEnum["ARCHIVO"] = "ARCHIVO";
})(TipoContenidoEnum || (TipoContenidoEnum = {}));
describe('Contenidos Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createContenidos', () => {
        it('CT1: Creación exitosa', async () => {
            const data = [
                { tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'Contenido 1' },
                { tipo: TipoContenidoEnum.IMAGEN, orden: 2, enlace_archivo: 'imagen.jpg' }
            ];
            const created = [{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }];
            contenidosService.createContenidos.mockResolvedValue(created);
            const req = (0, setup_1.createMockRequest)({ id_topico: 1, contenidos: data });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.createContenidos(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, created, 'Contenido(s) creado(s) correctamente'));
            expect(contenidosService.createContenidos).toHaveBeenCalledWith(1, data);
        });
        it('CT2: Falta id_topico', async () => {
            contenidosService.createContenidos.mockRejectedValue({ status: 400, message: 'El id_topico es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ id_topico: null, contenidos: [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }] });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.createContenidos(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El id_topico es obligatorio'));
        });
        it('CT3: No hay contenidos', async () => {
            contenidosService.createContenidos.mockRejectedValue({ status: 400, message: 'Debe incluir al menos un contenido' });
            const req = (0, setup_1.createMockRequest)({ id_topico: 1, contenidos: [] });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.createContenidos(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Debe incluir al menos un contenido'));
        });
        it('CT4: Tópico inexistente', async () => {
            contenidosService.createContenidos.mockRejectedValue({ status: 404, message: 'Tópico no encontrado' });
            const req = (0, setup_1.createMockRequest)({ id_topico: 9999, contenidos: [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }] });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.createContenidos(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
    });
    describe('updateContenido', () => {
        it('CT5: Actualización exitosa', async () => {
            const data = { orden: 2 };
            const updated = { id: 1, activo: true, ...data };
            contenidosService.updateContenido.mockResolvedValue(updated);
            const req = (0, setup_1.createMockRequest)(data, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.updateContenido(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updated, 'Contenido actualizado correctamente'));
            expect(contenidosService.updateContenido).toHaveBeenCalledWith(1, data);
        });
        it('CT6: Contenido inexistente', async () => {
            contenidosService.updateContenido.mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });
            const req = (0, setup_1.createMockRequest)({}, { id: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.updateContenido(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Contenido no encontrado'));
        });
    });
    describe('deleteContenido', () => {
        it('CT7: Eliminación exitosa', async () => {
            const deleted = { id: 1, activo: false };
            contenidosService.deleteContenido.mockResolvedValue(deleted);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.deleteContenido(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, deleted, 'Contenido eliminado correctamente'));
            expect(contenidosService.deleteContenido).toHaveBeenCalledWith(1);
        });
        it('CT8: Contenido inexistente', async () => {
            contenidosService.deleteContenido.mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });
            const req = (0, setup_1.createMockRequest)({}, { id: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.deleteContenido(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Contenido no encontrado'));
        });
        it('CT9: Contenido ya inactivo', async () => {
            contenidosService.deleteContenido.mockRejectedValue({ status: 400, message: 'El contenido ya está inactivo' });
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.deleteContenido(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El contenido ya está inactivo'));
        });
    });
    describe('getContenidosByTopico', () => {
        it('CT10: Listar contenidos de un tópico existente', async () => {
            const contenidos = [{ id: 1 }, { id: 2 }];
            contenidosService.getContenidosByTopico.mockResolvedValue(contenidos);
            const req = (0, setup_1.createMockRequest)({}, { id_topico: '1' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.getContenidosByTopico(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, contenidos));
            expect(contenidosService.getContenidosByTopico).toHaveBeenCalledWith(1);
        });
        it('CT11: Tópico inexistente', async () => {
            contenidosService.getContenidosByTopico.mockRejectedValue({ status: 404, message: 'Tópico no encontrado' });
            const req = (0, setup_1.createMockRequest)({}, { id_topico: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.getContenidosByTopico(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
    });
    describe('getContenidoById', () => {
        it('CT12: Contenido existente', async () => {
            const contenido = { id: 1 };
            contenidosService.getContenidoById.mockResolvedValue(contenido);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.getContenidoById(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, contenido));
            expect(contenidosService.getContenidoById).toHaveBeenCalledWith(1);
        });
        it('CT13: Contenido inexistente', async () => {
            contenidosService.getContenidoById.mockRejectedValue({ status: 404, message: 'Contenido no encontrado' });
            const req = (0, setup_1.createMockRequest)({}, { id: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.getContenidoById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Contenido no encontrado'));
        });
    });
    // REORDER CONTENIDOS
    describe('reorderContenidos', () => {
        it('CT14: Reordenamiento exitoso', async () => {
            const contenidos = [
                { id: 1, orden: 2 },
                { id: 2, orden: 1 },
                { id: 3, orden: 3 },
            ];
            contenidosService.reorderContenidos.mockResolvedValue({
                message: 'Contenidos reordenados correctamente',
                count: 3,
            });
            const req = (0, setup_1.createMockRequest)(contenidos);
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.reorderContenidos(req, res);
            expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Contenidos reordenados correctamente', count: 3 }, 'Contenidos reordenados correctamente'));
        });
        it('CT15: Error por array vacío', async () => {
            const contenidos = [];
            contenidosService.reorderContenidos.mockRejectedValue({
                status: 400,
                message: 'Debe enviar al menos un contenido para reordenar',
            });
            const req = (0, setup_1.createMockRequest)(contenidos);
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.reorderContenidos(req, res);
            expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Debe enviar al menos un contenido para reordenar'));
        });
        it('CT16: Error por contenido sin id o sin orden', async () => {
            const contenidos = [
                { id: 1 }, // falta orden
                { orden: 2 },
            ];
            contenidosService.reorderContenidos.mockRejectedValue({
                status: 400,
                message: 'Cada contenido debe tener id y orden válidos',
            });
            const req = (0, setup_1.createMockRequest)(contenidos);
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.reorderContenidos(req, res);
            expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Cada contenido debe tener id y orden válidos'));
        });
        it('CT17: Error por contenido inexistente en BD', async () => {
            const contenidos = [
                { id: 9999, orden: 1 },
                { id: 2, orden: 2 },
            ];
            contenidosService.reorderContenidos.mockRejectedValue({
                status: 404,
                message: 'Uno o más contenidos no existen',
            });
            const req = (0, setup_1.createMockRequest)(contenidos);
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.reorderContenidos(req, res);
            expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Uno o más contenidos no existen'));
        });
        it('CT18: Error interno inesperado', async () => {
            const contenidos = [
                { id: 1, orden: 1 },
                { id: 2, orden: 2 },
            ];
            contenidosService.reorderContenidos.mockRejectedValue(new Error('Error interno'));
            const req = (0, setup_1.createMockRequest)(contenidos);
            const res = (0, setup_1.createMockResponse)();
            await contenidosController.reorderContenidos(req, res);
            expect(contenidosService.reorderContenidos).toHaveBeenCalledWith(contenidos);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error interno'));
        });
    });
});
