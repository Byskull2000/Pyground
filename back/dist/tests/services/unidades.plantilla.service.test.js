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
const unidadPlantillaService = __importStar(require("../../services/unidades.plantilla.service"));
const unidadPlantillaRepo = __importStar(require("../../repositories/unidades.plantilla.repository"));
const cursoRepo = __importStar(require("../../repositories/cursos.repository"));
jest.mock('../../repositories/unidades.plantilla.repository');
jest.mock('../../repositories/cursos.repository');
describe('UnidadPlantilla Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        cursoRepo.getCursoById.mockResolvedValue({ id: 1, nombre: 'Curso A' });
    });
    // TEST - OBTENER UNIDADES
    describe('getUnidadesPlantilla', () => {
        it('UP11: Listar unidades de un curso existente', async () => {
            const mockUnidades = [
                { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true },
                { id: 2, id_curso: 1, titulo: 'Capítulo 2', orden: 2, version: 1, activo: true }
            ];
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue(mockUnidades);
            const result = await unidadPlantillaService.getUnidadesPlantilla(1);
            expect(result).toEqual(mockUnidades);
            expect(unidadPlantillaRepo.getUnidadesPlantillaByCurso).toHaveBeenCalledWith(1);
        });
        it('UP12: Curso sin unidades registradas', async () => {
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue([]);
            const result = await unidadPlantillaService.getUnidadesPlantilla(2);
            expect(result).toEqual([]);
        });
    });
    describe('getUnidadPlantilla', () => {
        it('UP1: Obtener unidad existente', async () => {
            const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(mockUnidad);
            const result = await unidadPlantillaService.getUnidadPlantilla(1);
            expect(result).toEqual(mockUnidad);
            expect(unidadPlantillaRepo.getUnidadPlantillaById).toHaveBeenCalledWith(1);
        });
        it('UP8/UP10: Unidad inexistente', async () => {
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(null);
            await expect(unidadPlantillaService.getUnidadPlantilla(999))
                .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
        });
    });
    // TEST - CREAR UNIDAD
    describe('createUnidadPlantilla', () => {
        const baseData = { id_curso: 1, titulo: 'Introducción', orden: 1 };
        it('UP1: Creación exitosa', async () => {
            const mockNueva = { id: 10, ...baseData, version: 1, activo: true };
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue([]);
            unidadPlantillaRepo.createUnidadPlantilla.mockResolvedValue(mockNueva);
            const result = await unidadPlantillaService.createUnidadPlantilla(baseData);
            expect(result).toEqual(mockNueva);
            expect(unidadPlantillaRepo.createUnidadPlantilla).toHaveBeenCalledWith({
                ...baseData,
                version: 1,
                activo: true
            });
        });
        it('UP2: Faltan título', async () => {
            const invalidData = { ...baseData, titulo: '' };
            await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
                .rejects.toMatchObject({ status: 400, message: 'El título es obligatorio' });
        });
        it('UP3: Faltan id_curso', async () => {
            const invalidData = { ...baseData, id_curso: null };
            await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
                .rejects.toMatchObject({ status: 400, message: 'El curso es obligatorio' });
        });
        it('UP4: Faltan orden', async () => {
            const invalidData = { ...baseData, orden: null };
            await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
                .rejects.toMatchObject({ status: 400, message: 'El orden es obligatorio' });
        });
        it('UP5: Unidad duplicada en el mismo curso', async () => {
            unidadPlantillaRepo.getUnidadPlantillaRedudante.mockResolvedValue([{ id: 1, titulo: 'Introducción' }]);
            await expect(unidadPlantillaService.createUnidadPlantilla(baseData))
                .rejects.toMatchObject({ status: 409, message: 'Ya existe una unidad con ese nombre para este curso' });
        });
        it('UP6: Error interno del repositorio', async () => {
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue([]);
            unidadPlantillaRepo.createUnidadPlantilla.mockRejectedValue(new Error('DB error'));
            await expect(unidadPlantillaService.createUnidadPlantilla(baseData))
                .rejects.toThrow('DB error');
        });
    });
    // TEST - ACTUALIZAR UNIDAD
    describe('updateUnidadPlantilla', () => {
        const updateData = { titulo: 'Nuevo Título' };
        it('UP7: Actualización exitosa', async () => {
            const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
            const updatedUnidad = { ...mockUnidad, ...updateData };
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(mockUnidad);
            unidadPlantillaRepo.updateUnidadPlantilla.mockResolvedValue(updatedUnidad);
            const result = await unidadPlantillaService.updateUnidadPlantilla(1, updateData);
            expect(result).toEqual(updatedUnidad);
            expect(unidadPlantillaRepo.updateUnidadPlantilla).toHaveBeenCalledWith(1, updateData);
        });
        it('UP8: Unidad inexistente', async () => {
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(null);
            await expect(unidadPlantillaService.updateUnidadPlantilla(999, updateData))
                .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
        });
    });
    // TEST - ELIMINACIÓN LÓGICA
    describe('deleteUnidadPlantilla', () => {
        it('UP9: Eliminación exitosa', async () => {
            const mockUnidad = { id: 1, activo: true };
            const updatedUnidad = { ...mockUnidad, activo: false };
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(mockUnidad);
            unidadPlantillaRepo.updateUnidadPlantilla.mockResolvedValue(updatedUnidad);
            const result = await unidadPlantillaService.deleteUnidadPlantilla(1);
            expect(result).toEqual(updatedUnidad);
            expect(unidadPlantillaRepo.updateUnidadPlantilla).toHaveBeenCalledWith(1, { activo: false });
        });
        it('UP10: Unidad inexistente', async () => {
            unidadPlantillaRepo.getUnidadPlantillaById.mockResolvedValue(null);
            await expect(unidadPlantillaService.deleteUnidadPlantilla(999))
                .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
        });
    });
});
