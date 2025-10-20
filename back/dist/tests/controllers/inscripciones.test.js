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
const inscripcionController = __importStar(require("../../controllers/inscripciones.controller"));
const inscripcionService = __importStar(require("../../services/inscripciones.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
jest.mock('../../services/inscripciones.service');
describe('Inscripciones Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // GET INSCRIPCIONES POR EDICIÓN
    describe('getInscripcionesByEdicion', () => {
        it('IS1: Debe retornar lista de inscripciones por edición', async () => {
            const mockInscripciones = [
                { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 },
                { id: 2, usuario_id: 2, edicion_id: 1, cargo_id: 2 }
            ];
            inscripcionService.getInscripcionesByEdicion.mockResolvedValue(mockInscripciones);
            const req = (0, setup_1.createMockRequest)({}, { id_edicion: '1' });
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.getInscripcionesByEdicion(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockInscripciones));
            expect(inscripcionService.getInscripcionesByEdicion).toHaveBeenCalledWith(1);
        });
        it('IS2: Debe retornar lista vacía si no hay inscripciones', async () => {
            inscripcionService.getInscripcionesByEdicion.mockResolvedValue([]);
            const req = (0, setup_1.createMockRequest)({}, { id_edicion: '2' });
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.getInscripcionesByEdicion(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, []));
            expect(inscripcionService.getInscripcionesByEdicion).toHaveBeenCalledWith(2);
        });
    });
    // GET INSCRIPCIÓN POR ID
    describe('getInscripcion', () => {
        it('IS3: Debe retornar una inscripción existente', async () => {
            const mockInscripcion = { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 };
            inscripcionService.getInscripcion.mockResolvedValue(mockInscripcion);
            const req = (0, setup_1.createMockRequest)({}, { id: '1' });
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.getInscripcion(req, res);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockInscripcion));
            expect(inscripcionService.getInscripcion).toHaveBeenCalledWith(1);
        });
        it('IS4: Debe manejar error si la inscripción no existe', async () => {
            inscripcionService.getInscripcion.mockRejectedValue({ status: 404, message: 'Inscripción no encontrada' });
            const req = (0, setup_1.createMockRequest)({}, { id: '999' });
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.getInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Inscripción no encontrada'));
        });
    });
    // CREAR INSCRIPCIÓN
    describe('createInscripcion', () => {
        const baseData = {
            usuario_id: 1,
            edicion_id: 1,
            cargo_id: 1
        };
        it('IS5: Creación exitosa de una inscripción', async () => {
            const mockNueva = { id: 10, ...baseData };
            inscripcionService.createInscripcion.mockResolvedValue(mockNueva);
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockNueva));
            expect(inscripcionService.createInscripcion).toHaveBeenCalledWith(baseData);
        });
        it('IS6: Faltan campos obligatorios', async () => {
            const invalidData = { edicion_id: 1, cargo_id: 1 };
            inscripcionService.createInscripcion.mockRejectedValue({ status: 400, message: 'El usuario es obligatorio' });
            const req = (0, setup_1.createMockRequest)(invalidData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El usuario es obligatorio'));
        });
        it('IS7: Usuario no encontrado', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 404, message: 'Usuario no encontrado o inactivo' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado o inactivo'));
        });
        it('IS8: Edición no encontrada o inactiva', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 404, message: 'Edición no encontrada o inactiva' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Edición no encontrada o inactiva'));
        });
        it('IS9: Edición no publicada', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 409, message: 'La edición no esta abierta a inscripciones' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La edición no esta abierta a inscripciones'));
        });
        it('IS10: Cargo no encontrado', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 404, message: 'Cargo no encontrado' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Cargo no encontrado'));
        });
        it('IS11: Usuario ya inscrito en la edición', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 409, message: 'El usuario ya está inscrito en esta edición' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'El usuario ya está inscrito en esta edición'));
        });
        it('IS12: Error interno al crear inscripción', async () => {
            inscripcionService.createInscripcion.mockRejectedValue({ status: 500, message: 'Error al registrar la inscripción' });
            const req = (0, setup_1.createMockRequest)(baseData);
            const res = (0, setup_1.createMockResponse)();
            await inscripcionController.createInscripcion(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al registrar la inscripción'));
        });
    });
});
