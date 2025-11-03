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
const unidadController = __importStar(require("../../controllers/unidades.controller"));
const unidadService = __importStar(require("../../services/unidades.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
jest.mock('../../services/unidades.service');
describe('Unidad Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // CREATE UNIDAD
    describe('createUnidad', () => {
        const baseData = { id_edicion: 1, titulo: 'Introducción', orden: 1 };
        it('U1: Creación exitosa de una unidad', async () => {
            const mockNueva = { id: 10, ...baseData, activo: true, estado_publicado: false };
            unidadService.createUnidad.mockResolvedValue(mockNueva);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockNueva));
            expect(unidadService.createUnidad).toHaveBeenCalledWith(baseData);
        });
        it('U2: Faltan campos obligatorios: título', async () => {
            unidadService.createUnidad.mockRejectedValue({ status: 400, message: 'El título es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, titulo: '' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El título es obligatorio'));
        });
        it('U3: Faltan campos obligatorios: id_edicion', async () => {
            unidadService.createUnidad.mockRejectedValue({ status: 400, message: 'La edición es obligatoria' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, id_edicion: null });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La edición es obligatoria'));
        });
        it('U4: Faltan campos obligatorios: orden', async () => {
            unidadService.createUnidad.mockRejectedValue({ status: 400, message: 'El orden es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, orden: null });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El orden es obligatorio'));
        });
        it('U5: Unidad duplicada en la misma edición', async () => {
            unidadService.createUnidad.mockRejectedValue({ status: 409, message: 'Ya existe una unidad con este titulo en este unidad' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Ya existe una unidad con este titulo en este unidad'));
        });
        it('U6: Error interno del repositorio', async () => {
            // El controller devuelve el message provisto en el error (fallback 'Error al crear unidad').
            unidadService.createUnidad.mockRejectedValue({ status: 500, message: 'Error al crear la unidad' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.createUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al crear la unidad'));
        });
    });
    // UPDATE UNIDAD
    describe('updateUnidad', () => {
        const updateData = { titulo: 'Nuevo Título' };
        it('U7: Actualización exitosa', async () => {
            const updatedUnidad = { id: 1, id_edicion: 1, titulo: 'Nuevo Título', activo: true };
            unidadService.updateUnidad.mockResolvedValue(updatedUnidad);
            const req = (0, setup_1.createMockRequest)(updateData, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.updateUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updatedUnidad));
            expect(unidadService.updateUnidad).toHaveBeenCalledWith(1, updateData);
        });
        it('U8: Unidad inexistente', async () => {
            unidadService.updateUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)(updateData, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.updateUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // DELETE UNIDAD
    describe('deleteUnidad', () => {
        it('U9: Eliminación exitosa', async () => {
            unidadService.deleteUnidad.mockResolvedValue({ id: 1, activo: false });
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.deleteUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidad eliminada correctamente' }));
            expect(unidadService.deleteUnidad).toHaveBeenCalledWith(1);
        });
        it('U10: Unidad inexistente', async () => {
            unidadService.deleteUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.deleteUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // RESTORE UNIDAD
    describe('restoreUnidad', () => {
        it('U11: Restauración exitosa', async () => {
            // controller devuelve mensaje; service mocked to resolve any value
            unidadService.restoreUnidad.mockResolvedValue({ id: 1, activo: true });
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.restoreUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidad restaurada correctamente' }));
            expect(unidadService.restoreUnidad).toHaveBeenCalledWith(1);
        });
        it('U12: Unidad inexistente', async () => {
            unidadService.restoreUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.restoreUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // PUBLICATE UNIDAD
    describe('publicateUnidad', () => {
        it('U13: Publicación exitosa', async () => {
            unidadService.publicateUnidad.mockResolvedValue({ id: 1, estado_publicado: true });
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.publicateUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidad publicada correctamente' }));
            expect(unidadService.publicateUnidad).toHaveBeenCalledWith(1);
        });
        it('U14: Unidad inexistente', async () => {
            unidadService.publicateUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.publicateUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // DEACTIVATE UNIDAD
    describe('deactivateUnidad', () => {
        it('U15: Desactivación exitosa', async () => {
            unidadService.deactivateUnidad.mockResolvedValue({ id: 1, estado_publicado: false });
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.deactivateUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidad archivada correctamente' }));
            expect(unidadService.deactivateUnidad).toHaveBeenCalledWith(1);
        });
        it('U16: Unidad inexistente', async () => {
            unidadService.deactivateUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.deactivateUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // GET UNIDADES BY EDICION
    describe('getUnidadesByEdicion', () => {
        it('U17: Listar unidades de una edición existente', async () => {
            const mockUnidades = [{ id: 1, id_edicion: 1, titulo: 'Intro' }];
            unidadService.getUnidadesByEdicion.mockResolvedValue(mockUnidades);
            const req = (0, setup_1.createMockRequest)({}, { id_edicion: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.getUnidadesByEdicion(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUnidades));
            expect(unidadService.getUnidadesByEdicion).toHaveBeenCalledWith(1);
        });
        it('U18: Edición sin unidades registradas', async () => {
            unidadService.getUnidadesByEdicion.mockResolvedValue([]);
            const req = (0, setup_1.createMockRequest)({}, { id_edicion: '2' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.getUnidadesByEdicion(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, []));
            expect(unidadService.getUnidadesByEdicion).toHaveBeenCalledWith(2);
        });
        it('U19: Edición inexistente', async () => {
            unidadService.getUnidadesByEdicion.mockRejectedValue({ status: 404, message: 'Edición no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id_edicion: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.getUnidadesByEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Edición no encontrada'));
        });
    });
    // GET UNIDAD BY ID
    describe('getUnidad', () => {
        it('U20: Consulta exitosa', async () => {
            const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Intro' };
            unidadService.getUnidad.mockResolvedValue(mockUnidad);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.getUnidad(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUnidad));
            expect(unidadService.getUnidad).toHaveBeenCalledWith(1);
        });
        it('U21: Unidad inexistente', async () => {
            unidadService.getUnidad.mockRejectedValue({ status: 404, message: 'Unidad no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadController.getUnidad(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
    });
    // REORDER UNIDADES
    describe('reorderUnidades', () => {
        it('U22: Reordenamiento exitoso', async () => {
            const unidades = [
                { id: 1, orden: 2 },
                { id: 2, orden: 1 },
                { id: 3, orden: 3 },
            ];
            unidadService.reorderUnidades.mockResolvedValue({ message: 'Unidades reordenadas correctamente', count: 3 });
            const req = (0, setup_1.createMockRequest)(unidades);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.reorderUnidades(req, res);
            expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidades reordenadas correctamente', count: 3 }, 'Unidades reordenadas correctamente'));
        });
        it('U23: Error por array vacío', async () => {
            const unidades = [];
            unidadService.reorderUnidades.mockRejectedValue({ status: 400, message: 'Debe enviar al menos una unidad para reordenar' });
            const req = (0, setup_1.createMockRequest)(unidades);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.reorderUnidades(req, res);
            expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Debe enviar al menos una unidad para reordenar'));
        });
        it('U24: Error por unidad sin id o sin orden', async () => {
            const unidades = [
                { id: 1 }, // falta orden
                { orden: 2 } // falta id
            ];
            unidadService.reorderUnidades.mockRejectedValue({ status: 400, message: 'Cada unidad debe tener id y orden válidos' });
            const req = (0, setup_1.createMockRequest)(unidades);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.reorderUnidades(req, res);
            expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Cada unidad debe tener id y orden válidos'));
        });
        it('U25: Error por unidad inexistente en BD', async () => {
            const unidades = [
                { id: 9999, orden: 1 },
                { id: 2, orden: 2 },
            ];
            unidadService.reorderUnidades.mockRejectedValue({ status: 404, message: 'Una o más unidades no existen' });
            const req = (0, setup_1.createMockRequest)(unidades);
            const res = (0, setup_1.createMockResponse)();
            await unidadController.reorderUnidades(req, res);
            expect(unidadService.reorderUnidades).toHaveBeenCalledWith(unidades);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Una o más unidades no existen'));
        });
    });
});
