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
const inscripcionService = __importStar(require("../../services/inscripciones.service"));
const inscripcionRepo = __importStar(require("../../repositories/inscripciones.repository"));
const usuarioRepo = __importStar(require("../../repositories/usuarios.repository"));
const edicionRepo = __importStar(require("../../repositories/ediciones.repository"));
const cargoRepo = __importStar(require("../../repositories/cargos.repository"));
jest.mock('../../repositories/inscripciones.repository');
jest.mock('../../repositories/usuarios.repository');
jest.mock('../../repositories/ediciones.repository');
jest.mock('../../repositories/cargos.repository');
describe('Inscripciones Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // TEST - GET INSCRIPCIONES POR EDICIÓN
    describe('getInscripcionesByEdicion', () => {
        it('IS1: Debe retornar lista de inscripciones por edición', async () => {
            const mockInscripciones = [
                { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 },
                { id: 2, usuario_id: 2, edicion_id: 1, cargo_id: 2 }
            ];
            inscripcionRepo.getInscripcionesByEdicion.mockResolvedValue(mockInscripciones);
            const result = await inscripcionService.getInscripcionesByEdicion(1);
            expect(result).toEqual(mockInscripciones);
            expect(inscripcionRepo.getInscripcionesByEdicion).toHaveBeenCalledWith(1);
        });
        it('IS2: Debe retornar lista vacía si no hay inscripciones', async () => {
            inscripcionRepo.getInscripcionesByEdicion.mockResolvedValue([]);
            const result = await inscripcionService.getInscripcionesByEdicion(2);
            expect(result).toEqual([]);
            expect(inscripcionRepo.getInscripcionesByEdicion).toHaveBeenCalledWith(2);
        });
    });
    // TEST - GET INSCRIPCIÓN POR ID
    describe('getInscripcion', () => {
        it('IS3: Debe retornar una inscripción existente', async () => {
            const mockInscripcion = { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 };
            inscripcionRepo.getInscripcionById.mockResolvedValue(mockInscripcion);
            const result = await inscripcionService.getInscripcion(1);
            expect(result).toEqual(mockInscripcion);
            expect(inscripcionRepo.getInscripcionById).toHaveBeenCalledWith(1);
        });
        it('IS4: Debe lanzar error si la inscripción no existe', async () => {
            inscripcionRepo.getInscripcionById.mockResolvedValue(null);
            await expect(inscripcionService.getInscripcion(999))
                .rejects.toMatchObject({ status: 404, message: 'Inscripción no encontrada' });
        });
    });
    // TEST - CREAR INSCRIPCIÓN
    describe('createInscripcion', () => {
        const baseData = {
            usuario_id: 1,
            edicion_id: 1,
            cargo_id: 1
        };
        it('IS5: Creación exitosa de una inscripción', async () => {
            const mockUsuario = { id: 1, nombre: 'Usuario Test' };
            const mockEdicion = { id: 1, activo: true, estado_publicado: true };
            const mockCargo = { id: 1, nombre: 'Estudiante' };
            const mockNueva = { id: 10, ...baseData };
            usuarioRepo.getUsuarioById.mockResolvedValue(mockUsuario);
            edicionRepo.getEdicionById.mockResolvedValue(mockEdicion);
            cargoRepo.getCargoById.mockResolvedValue(mockCargo);
            inscripcionRepo.getInscripcionesByEdicion.mockResolvedValue([]);
            inscripcionRepo.createInscripcion.mockResolvedValue(mockNueva);
            inscripcionRepo.getInscripcionById.mockResolvedValue(mockNueva);
            const result = await inscripcionService.createInscripcion(baseData);
            expect(result).toEqual(mockNueva);
            expect(inscripcionRepo.createInscripcion).toHaveBeenCalledWith(baseData);
            expect(inscripcionRepo.getInscripcionById).toHaveBeenCalledWith(mockNueva.id);
        });
        it('IS6: Faltan campos obligatorios', async () => {
            const invalidData = { edicion_id: 1, cargo_id: 1 };
            await expect(inscripcionService.createInscripcion(invalidData))
                .rejects.toMatchObject({ status: 400, message: 'El usuario es obligatorio' });
        });
        it('IS7: Usuario no encontrado', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue(null);
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado o inactivo' });
        });
        it('IS8: Edición no encontrada o inactiva', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue({ id: 1 });
            edicionRepo.getEdicionById.mockResolvedValue({ id: 1, activo: false });
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 404, message: 'Edición no encontrada o inactiva' });
        });
        it('IS9: Edición no publicada', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue({ id: 1 });
            edicionRepo.getEdicionById.mockResolvedValue({ id: 1, activo: true, estado_publicado: false });
            cargoRepo.getCargoById.mockResolvedValue({ id: 1, nombre: 'Estudiante' });
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 409, message: 'La edición no esta abierta a inscripciones' });
        });
        it('IS10: Cargo no encontrado', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue({ id: 1 });
            edicionRepo.getEdicionById.mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
            cargoRepo.getCargoById.mockResolvedValue(null);
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 404, message: 'Cargo no encontrado' });
        });
        it('IS11: Usuario ya inscrito en la edición', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue({ id: 1 });
            edicionRepo.getEdicionById.mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
            cargoRepo.getCargoById.mockResolvedValue({ id: 1 });
            inscripcionRepo.getInscripcionesByEdicion.mockResolvedValue([{ id: 5, usuario_id: 1 }]);
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 409, message: 'El usuario ya está inscrito en esta edición' });
        });
        it('IS12: Error al crear inscripción (error interno)', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue({ id: 1 });
            edicionRepo.getEdicionById.mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
            cargoRepo.getCargoById.mockResolvedValue({ id: 1 });
            inscripcionRepo.getInscripcionesByEdicion.mockResolvedValue([]);
            inscripcionRepo.createInscripcion.mockRejectedValue(new Error('DB error'));
            await expect(inscripcionService.createInscripcion(baseData))
                .rejects.toMatchObject({ status: 500, message: 'Error al registrar la inscripción' });
        });
    });
});
