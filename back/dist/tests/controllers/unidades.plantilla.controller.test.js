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
const unidadPlantillaController = __importStar(require("../../controllers/unidades.plantilla.controller"));
const unidadPlantillaService = __importStar(require("../../services/unidades.plantilla.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
jest.mock('../../services/unidades.plantilla.service');
describe('UnidadPlantilla Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // GET UNIDADES
    describe('getUnidadesPlantilla', () => {
        it('UP11: Listar unidades de un curso existente', async () => {
            const mockUnidades = [
                { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true }
            ];
            unidadPlantillaService.getUnidadesPlantilla.mockResolvedValue(mockUnidades);
            const req = (0, setup_1.createMockRequest)({}, { id_curso: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.getUnidadesPlantilla(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUnidades));
            expect(unidadPlantillaService.getUnidadesPlantilla).toHaveBeenCalledWith(1);
        });
        it('UP12: Curso sin unidades registradas', async () => {
            unidadPlantillaService.getUnidadesPlantilla.mockResolvedValue([]);
            const req = (0, setup_1.createMockRequest)({}, { id_curso: '2' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.getUnidadesPlantilla(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, []));
            expect(unidadPlantillaService.getUnidadesPlantilla).toHaveBeenCalledWith(2);
        });
        it('UP13: Curso inexistente', async () => {
            unidadPlantillaService.getUnidadesPlantilla.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
            const req = (0, setup_1.createMockRequest)({}, { id_curso: '9999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.getUnidadesPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        });
    });
    // GET UNIDAD
    describe('getUnidadPlantilla', () => {
        it('UP1: Obtener unidad existente', async () => {
            const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
            unidadPlantillaService.getUnidadPlantilla.mockResolvedValue(mockUnidad);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.getUnidadPlantilla(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockUnidad));
            expect(unidadPlantillaService.getUnidadPlantilla).toHaveBeenCalledWith(1);
        });
        it('UP8/UP10: Unidad inexistente', async () => {
            unidadPlantillaService.getUnidadPlantilla.mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.getUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        });
    });
    // CREATE UNIDAD
    describe('createUnidadPlantilla', () => {
        const baseData = { id_curso: 1, titulo: 'Introducción', orden: 1 };
        it('UP1: Creación exitosa', async () => {
            const mockNueva = { id: 10, ...baseData, version: 1, activo: true };
            unidadPlantillaService.createUnidadPlantilla.mockResolvedValue(mockNueva);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockNueva));
            expect(unidadPlantillaService.createUnidadPlantilla).toHaveBeenCalledWith(baseData);
        });
        it('UP2: Faltan título', async () => {
            unidadPlantillaService.createUnidadPlantilla.mockRejectedValue({ status: 400, message: 'El título es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, titulo: '' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El título es obligatorio'));
        });
        it('UP3: Faltan id_curso', async () => {
            unidadPlantillaService.createUnidadPlantilla.mockRejectedValue({ status: 400, message: 'El curso es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, id_curso: null });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El curso es obligatorio'));
        });
        it('UP4: Faltan orden', async () => {
            unidadPlantillaService.createUnidadPlantilla.mockRejectedValue({ status: 400, message: 'El orden es obligatorio' });
            const req = (0, setup_1.createMockRequest)({ ...baseData, orden: null });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El orden es obligatorio'));
        });
        it('UP5: Unidad duplicada', async () => {
            unidadPlantillaService.createUnidadPlantilla.mockRejectedValue({ status: 409, message: 'Ya existe una unidad con ese nombre para este curso' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Ya existe una unidad con ese nombre para este curso'));
        });
        it('UP6: Error interno del repositorio', async () => {
            unidadPlantillaService.createUnidadPlantilla.mockRejectedValue({ status: 500, message: 'Error al crear la unidad plantilla' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.createUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al crear la unidad plantilla'));
        });
    });
    // UPDATE UNIDAD
    describe('updateUnidadPlantilla', () => {
        const updateData = { titulo: 'Nuevo Título' };
        it('UP7: Actualización exitosa', async () => {
            const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
            const updatedUnidad = { ...mockUnidad, ...updateData };
            unidadPlantillaService.updateUnidadPlantilla.mockResolvedValue(updatedUnidad);
            const req = (0, setup_1.createMockRequest)(updateData, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.updateUnidadPlantilla(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updatedUnidad));
            expect(unidadPlantillaService.updateUnidadPlantilla).toHaveBeenCalledWith(1, updateData);
        });
        it('UP8: Unidad inexistente', async () => {
            unidadPlantillaService.updateUnidadPlantilla.mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });
            const req = (0, setup_1.createMockRequest)(updateData, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.updateUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        });
    });
    // DELETE UNIDAD
    describe('deleteUnidadPlantilla', () => {
        it('UP9: Eliminación exitosa', async () => {
            const mockResponse = { id: 1, activo: false };
            unidadPlantillaService.deleteUnidadPlantilla.mockResolvedValue(mockResponse);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.deleteUnidadPlantilla(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, { message: 'Unidad plantilla eliminada correctamente' }));
            expect(unidadPlantillaService.deleteUnidadPlantilla).toHaveBeenCalledWith(1);
        });
        it('UP10: Unidad inexistente', async () => {
            unidadPlantillaService.deleteUnidadPlantilla.mockRejectedValue({ status: 404, message: 'Unidad plantilla no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await unidadPlantillaController.deleteUnidadPlantilla(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        });
    });
});
