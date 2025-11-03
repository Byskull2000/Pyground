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
const unidadService = __importStar(require("../../services/unidades.service"));
const unidadRepo = __importStar(require("../../repositories/unidades.repository"));
const edicionRepo = __importStar(require("../../repositories/ediciones.repository"));
jest.mock('../../repositories/unidades.repository');
jest.mock('../../repositories/ediciones.repository');
describe('Unidad Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        edicionRepo.getEdicionById.mockResolvedValue({ id: 1, nombre: 'Edición 1' });
    });
    // TEST - REGISTRO DE UNIDAD
    describe('createUnidad', () => {
        const baseData = { id_edicion: 1, titulo: 'Introducción', orden: 1 };
        it('U1: Creación exitosa de una unidad', async () => {
            unidadRepo.getUnidadRedudante.mockResolvedValue(null);
            const mockNueva = { id: 10, ...baseData, activo: true, estado_publicado: false };
            unidadRepo.createUnidad.mockResolvedValue(mockNueva);
            const result = await unidadService.createUnidad(baseData);
            expect(result).toEqual(mockNueva);
            expect(unidadRepo.createUnidad).toHaveBeenCalledWith(baseData);
        });
        it('U2: Faltan campos obligatorios: título', async () => {
            await expect(unidadService.createUnidad({ ...baseData, titulo: '' }))
                .rejects.toMatchObject({ status: 400, message: 'El título es obligatorio' });
        });
        it('U3: Faltan campos obligatorios: id_edicion', async () => {
            await expect(unidadService.createUnidad({ ...baseData, id_edicion: null }))
                .rejects.toMatchObject({ status: 400, message: 'La edición es obligatoria' });
        });
        it('U4: Faltan campos obligatorios: orden', async () => {
            await expect(unidadService.createUnidad({ ...baseData, orden: undefined }))
                .rejects.toMatchObject({ status: 400, message: 'El orden es obligatorio' });
        });
        it('U5: Unidad duplicada en la misma edición', async () => {
            unidadRepo.getUnidadRedudante.mockResolvedValue({ id: 1 });
            await expect(unidadService.createUnidad(baseData))
                .rejects.toMatchObject({ status: 409, message: 'Ya existe una unidad con este titulo en este unidad' });
        });
        it('U6: Error interno del repositorio', async () => {
            unidadRepo.getUnidadRedudante.mockResolvedValue(null);
            unidadRepo.createUnidad.mockRejectedValue(new Error('Error al crear la unidad'));
            await expect(unidadService.createUnidad(baseData))
                .rejects.toThrow('Error al crear la unidad');
        });
    });
    // TEST - ACTUALIZACIÓN DE UNIDAD
    describe('updateUnidad', () => {
        const updateData = { titulo: 'Nuevo Título' };
        it('U7: Actualización exitosa', async () => {
            const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Introducción', activo: true };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            const updatedUnidad = { ...mockUnidad, ...updateData };
            unidadRepo.updateUnidad.mockResolvedValue(updatedUnidad);
            const result = await unidadService.updateUnidad(1, updateData);
            expect(result).toEqual(updatedUnidad);
            expect(unidadRepo.updateUnidad).toHaveBeenCalledWith(1, updateData);
        });
        it('U8: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.updateUnidad(9999, updateData))
                .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
        });
    });
    // TEST - ELIMINACIÓN LÓGICA DE UNIDAD
    describe('deleteUnidad', () => {
        it('U9: Eliminación exitosa', async () => {
            const mockUnidad = { id: 1, activo: true };
            const deletedUnidad = { ...mockUnidad, activo: false };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            unidadRepo.deleteUnidad.mockResolvedValue(deletedUnidad);
            const result = await unidadService.deleteUnidad(1);
            expect(result).toEqual(deletedUnidad);
            expect(unidadRepo.deleteUnidad).toHaveBeenCalledWith(1);
        });
        it('U10: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.deleteUnidad(9999))
                .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
        });
    });
    // TEST - RESTAURACIÓN DE UNIDAD
    describe('restoreUnidad', () => {
        it('U11: Restauración exitosa', async () => {
            const mockUnidad = { id: 1, activo: false };
            const restored = { ...mockUnidad, activo: true };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            unidadRepo.restoreUnidad.mockResolvedValue(restored);
            const result = await unidadService.restoreUnidad(1);
            expect(result).toEqual(restored);
            expect(unidadRepo.restoreUnidad).toHaveBeenCalledWith(1);
        });
        it('U12: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.restoreUnidad(9999))
                .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
        });
    });
    // TEST - PUBLICACIÓN DE UNIDAD
    describe('publicateUnidad', () => {
        it('U13: Publicación exitosa', async () => {
            const mockUnidad = { id: 1 };
            const published = { ...mockUnidad, estado_publicado: true };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            unidadRepo.publicateUnidad.mockResolvedValue(published);
            const result = await unidadService.publicateUnidad(1);
            expect(result).toEqual(published);
            expect(unidadRepo.publicateUnidad).toHaveBeenCalledWith(1);
        });
        it('U14: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.publicateUnidad(9999))
                .rejects.toMatchObject({ status: 404 });
        });
    });
    // TEST - DESACTIVACIÓN DE UNIDAD
    describe('deactivateUnidad', () => {
        it('U15: Desactivación exitosa', async () => {
            const mockUnidad = { id: 1 };
            const deactivated = { ...mockUnidad, estado_publicado: false };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            unidadRepo.deactivateUnidad.mockResolvedValue(deactivated);
            const result = await unidadService.deactivateUnidad(1);
            expect(result).toEqual(deactivated);
            expect(unidadRepo.deactivateUnidad).toHaveBeenCalledWith(1);
        });
        it('U16: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.deactivateUnidad(9999))
                .rejects.toMatchObject({ status: 404 });
        });
    });
    // TEST - OBTENER UNIDADES POR EDICIÓN
    describe('getUnidadesByEdicion', () => {
        it('U17: Listar unidades de una edición existente', async () => {
            const mockUnidades = [{ id: 1, id_edicion: 1, titulo: 'Intro' }];
            unidadRepo.getUnidadesByEdicion.mockResolvedValue(mockUnidades);
            const result = await unidadService.getUnidadesByEdicion(1);
            expect(result).toEqual(mockUnidades);
            expect(unidadRepo.getUnidadesByEdicion).toHaveBeenCalledWith(1);
        });
        it('U18: Edición sin unidades registradas', async () => {
            unidadRepo.getUnidadesByEdicion.mockResolvedValue([]);
            const result = await unidadService.getUnidadesByEdicion(2);
            expect(result).toEqual([]);
        });
        it('U19: Edición inexistente', async () => {
            edicionRepo.getEdicionById.mockResolvedValue(null);
            await expect(unidadService.getUnidadesByEdicion(9999))
                .rejects.toMatchObject({ status: 404, message: 'Edición no encontrada' });
        });
    });
    // TEST - OBTENER UNIDAD POR ID
    describe('getUnidad', () => {
        it('U20: Consulta exitosa', async () => {
            const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Intro' };
            unidadRepo.getUnidadById.mockResolvedValue(mockUnidad);
            const result = await unidadService.getUnidad(1);
            expect(result).toEqual(mockUnidad);
            expect(unidadRepo.getUnidadById).toHaveBeenCalledWith(1);
        });
        it('U21: Unidad inexistente', async () => {
            unidadRepo.getUnidadById.mockResolvedValue(null);
            await expect(unidadService.getUnidad(9999))
                .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
        });
    });
    // TEST - REORDENAMIENTO DE UNIDADES
    describe('reorderUnidades', () => {
        const unidadesValidas = [
            { id: 1, orden: 2 },
            { id: 2, orden: 1 },
        ];
        it('U22: Reordenamiento exitoso', async () => {
            unidadRepo.existUnidadesByIds.mockResolvedValue([1, 2]);
            unidadRepo.reorderUnidades.mockResolvedValue(unidadesValidas);
            const result = await unidadService.reorderUnidades(unidadesValidas);
            expect(result).toEqual({
                message: 'Unidades reordenadas correctamente',
                count: unidadesValidas.length,
            });
            expect(unidadRepo.reorderUnidades).toHaveBeenCalledWith(unidadesValidas);
        });
        it('U23: Error por array vacío', async () => {
            await expect(unidadService.reorderUnidades([]))
                .rejects.toMatchObject({ status: 400, message: 'Debe enviar al menos una unidad para reordenar' });
        });
        it('U24: Error por unidad sin id o sin orden', async () => {
            const invalidUnidades = [
                { id: 1 }, // falta orden
                { orden: 2 },
            ];
            await expect(unidadService.reorderUnidades(invalidUnidades))
                .rejects.toMatchObject({ status: 400, message: 'Cada unidad debe tener id y orden válidos' });
        });
        it('U25: Error por unidad inexistente', async () => {
            const unidades = [{ id: 1, orden: 1 }, { id: 2, orden: 2 }];
            unidadRepo.existUnidadesByIds.mockResolvedValue([1]);
            await expect(unidadService.reorderUnidades(unidades))
                .rejects.toMatchObject({ status: 404, message: 'Una o más unidades no existen' });
        });
        it('U26: Error interno del repositorio', async () => {
            unidadRepo.existUnidadesByIds.mockResolvedValue([1, 2]);
            unidadRepo.reorderUnidades.mockRejectedValue(new Error('Error al reordenar'));
            await expect(unidadService.reorderUnidades(unidadesValidas))
                .rejects.toThrow('Error al reordenar');
        });
    });
});
