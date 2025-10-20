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
const edicionController = __importStar(require("../../controllers/ediciones.controller"));
const edicionService = __importStar(require("../../services/ediciones.service"));
const setup_1 = require("../setup");
const apiResponse_1 = require("../../utils/apiResponse");
jest.mock('../../services/ediciones.service');
describe('Ediciones Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createEdicion', () => {
        it('ED1: Creación exitosa de una edición', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición 2025',
                descripcion: 'Descripción opcional',
                fecha_apertura: '2025-10-15T00:00:00.000Z',
                fecha_cierre: null,
                creado_por: 'admin@correo.com'
            };
            const createdEdicion = { id: 1, ...newEdicion };
            edicionService.createEdicion.mockResolvedValue(createdEdicion);
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, createdEdicion));
        });
        it('ED2: Faltan campos obligatorios', async () => {
            const newEdicion = { id_curso: 1 };
            edicionService.createEdicion.mockRejectedValue({ status: 400, message: 'Faltan campos obligatorios' });
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Faltan campos obligatorios'));
        });
        it('ED3: Curso inexistente', async () => {
            const newEdicion = {
                id_curso: 9999,
                nombre_edicion: 'Edición 2025',
                fecha_apertura: '2025-10-15T00:00:00.000Z'
            };
            edicionService.createEdicion.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Curso no encontrado'));
        });
        it('ED4: Fecha de apertura inválida', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición 2025',
                fecha_apertura: 'fecha-invalida'
            };
            edicionService.createEdicion.mockRejectedValue({ status: 400, message: 'La fecha de apertura es inválida' });
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La fecha de apertura es inválida'));
        });
        it('ED5: Duplicado de edición dentro del mismo curso', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición 2025',
                fecha_apertura: '2025-10-15T00:00:00.000Z'
            };
            edicionService.createEdicion.mockRejectedValue({ status: 409, message: 'Ya existe una edición con ese nombre para este curso' });
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Ya existe una edición con ese nombre para este curso'));
        });
        it('ED6: Fecha de cierre antes de la apertura', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición 2025',
                fecha_apertura: '2025-10-15T00:00:00.000Z',
                fecha_cierre: '2025-10-10T00:00:00.000Z'
            };
            edicionService.createEdicion.mockRejectedValue({ status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' });
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'La fecha de apertura no puede ser mayor a la fecha de cierre'));
        });
        it('ED11: Creación de edición con unidades clonadas desde plantilla', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Curso 2025-I',
                descripcion: 'Curso con unidades replicadas',
                fecha_apertura: '2025-01-01T00:00:00.000Z',
                fecha_cierre: '2025-12-31T00:00:00.000Z',
                creado_por: 'admin@correo.com'
            };
            const createdEdicion = {
                id: 10,
                ...newEdicion,
                activo: true,
                fecha_creacion: new Date(),
                mensaje_extra: '(3 unidades creadas desde la plantilla)'
            };
            edicionService.createEdicion.mockResolvedValue(createdEdicion);
            const req = (0, setup_1.createMockRequest)(newEdicion);
            const res = (0, setup_1.createMockResponse)();
            await edicionController.createEdicion(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, createdEdicion));
            expect(edicionService.createEdicion).toHaveBeenCalledWith({
                ...newEdicion,
                fecha_apertura: "2025-01-01T00:00:00.000Z",
                fecha_cierre: "2025-12-31T00:00:00.000Z"
            });
            expect(createdEdicion.mensaje_extra).toBe('(3 unidades creadas desde la plantilla)');
        });
    });
});
