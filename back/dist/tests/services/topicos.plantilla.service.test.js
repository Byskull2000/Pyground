"use strict";
// back/src/tests/services/topicos.plantilla.service.test.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../../repositories/topicos.plantilla.repository', () => ({
    __esModule: true,
    default: {
        getTopicosByUnidadPlantilla: jest.fn(),
        getTopicoPlantillaById: jest.fn(),
        createTopicoPlantilla: jest.fn(),
        updateTopicoPlantilla: jest.fn(),
        deleteTopicoPlantilla: jest.fn(),
        getMaxOrden: jest.fn(),
    },
    TopicosPlantillaRepository: jest.fn(),
}));
const topicosService = __importStar(require("../../services/topicos.plantilla.service"));
const topicos_plantilla_repository_1 = __importDefault(require("../../repositories/topicos.plantilla.repository"));
describe('Topicos Plantilla Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getTopicosByUnidadPlantilla', () => {
        it('debe obtener tópicos de una unidad plantilla', async () => {
            const mockTopicos = [
                { id: 1, titulo: 'Tópico 1', orden: 1, activo: true },
                { id: 2, titulo: 'Tópico 2', orden: 2, activo: true }
            ];
            topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla.mockResolvedValue(mockTopicos);
            const result = await topicosService.getTopicosByUnidadPlantilla(1);
            expect(topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockTopicos);
            expect(result).toHaveLength(2);
        });
        it('debe retornar array vacío si no hay tópicos', async () => {
            topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla.mockResolvedValue([]);
            const result = await topicosService.getTopicosByUnidadPlantilla(999);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
        it('debe lanzar error si falla la consulta', async () => {
            topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla.mockRejectedValue(new Error('Database connection error'));
            await expect(topicosService.getTopicosByUnidadPlantilla(1)).rejects.toThrow('Database connection error');
        });
    });
    describe('getTopicoPlantillaById', () => {
        it('debe obtener un tópico por su id', async () => {
            const mockTopico = {
                id: 1,
                titulo: 'Tópico Test',
                id_unidad_plantilla: 1,
                activo: true
            };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(mockTopico);
            const result = await topicosService.getTopicoPlantillaById(1);
            expect(topicos_plantilla_repository_1.default.getTopicoPlantillaById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockTopico);
        });
        it('debe lanzar error si el tópico no existe', async () => {
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(null);
            await expect(topicosService.getTopicoPlantillaById(999)).rejects.toThrow('Tópico no encontrado');
        });
    });
    describe('createTopicoPlantilla', () => {
        it('debe crear un tópico plantilla con orden automático', async () => {
            const topicoData = {
                titulo: 'Nuevo Tópico',
                descripcion: 'Descripción test',
                duracion_estimada: 60,
                version: 1
            };
            const createdTopico = {
                id: 1,
                ...topicoData,
                id_unidad_plantilla: 1,
                orden: 3,
                activo: true
            };
            // Mock para obtener el orden máximo actual
            topicos_plantilla_repository_1.default.getMaxOrden.mockResolvedValue(2);
            topicos_plantilla_repository_1.default.createTopicoPlantilla.mockResolvedValue(createdTopico);
            const result = await topicosService.createTopicoPlantilla(1, topicoData);
            expect(topicos_plantilla_repository_1.default.getMaxOrden).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.createTopicoPlantilla).toHaveBeenCalledWith({
                id_unidad_plantilla: 1,
                ...topicoData,
                orden: 3,
                publicado: false,
                activo: true
            });
            expect(result).toEqual(createdTopico);
            expect(result.orden).toBe(3);
        });
        it('debe crear el primer tópico con orden 1', async () => {
            const topicoData = {
                titulo: 'Primer Tópico',
                duracion_estimada: 60,
                version: 1
            };
            const createdTopico = {
                id: 1,
                ...topicoData,
                id_unidad_plantilla: 1,
                orden: 1,
                activo: true
            };
            topicos_plantilla_repository_1.default.getMaxOrden.mockResolvedValue(0);
            topicos_plantilla_repository_1.default.createTopicoPlantilla.mockResolvedValue(createdTopico);
            const result = await topicosService.createTopicoPlantilla(1, topicoData);
            expect(result.orden).toBe(1);
        });
        it('debe crear tópico con objetivos de aprendizaje', async () => {
            const topicoData = {
                titulo: 'Tópico con objetivos',
                duracion_estimada: 60,
                version: 1,
                objetivos_aprendizaje: 'Aprender conceptos básicos'
            };
            const createdTopico = {
                id: 1,
                ...topicoData,
                id_unidad_plantilla: 1,
                orden: 1,
                activo: true
            };
            topicos_plantilla_repository_1.default.getMaxOrden.mockResolvedValue(0);
            topicos_plantilla_repository_1.default.createTopicoPlantilla.mockResolvedValue(createdTopico);
            const result = await topicosService.createTopicoPlantilla(1, topicoData);
            expect(result.objetivos_aprendizaje).toBe('Aprender conceptos básicos');
        });
        it('debe lanzar error si falla la creación', async () => {
            const topicoData = {
                titulo: 'Nuevo Tópico',
                duracion_estimada: 60,
                version: 1
            };
            topicos_plantilla_repository_1.default.getMaxOrden.mockResolvedValue(0);
            topicos_plantilla_repository_1.default.createTopicoPlantilla.mockRejectedValue(new Error('Database error'));
            await expect(topicosService.createTopicoPlantilla(1, topicoData)).rejects.toThrow('Database error');
        });
    });
    describe('updateTopicoPlantilla', () => {
        it('debe actualizar un tópico plantilla', async () => {
            const updateData = {
                titulo: 'Tópico Actualizado',
                duracion_estimada: 90
            };
            const existingTopico = {
                id: 1,
                titulo: 'Tópico Original',
                duracion_estimada: 60,
                activo: true
            };
            const updatedTopico = {
                ...existingTopico,
                ...updateData
            };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.updateTopicoPlantilla.mockResolvedValue(updatedTopico);
            const result = await topicosService.updateTopicoPlantilla(1, updateData);
            expect(topicos_plantilla_repository_1.default.getTopicoPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.updateTopicoPlantilla).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedTopico);
        });
        it('debe actualizar solo el título', async () => {
            const updateData = { titulo: 'Solo título actualizado' };
            const existingTopico = {
                id: 1,
                titulo: 'Título original',
                duracion_estimada: 60
            };
            const updatedTopico = { ...existingTopico, ...updateData };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.updateTopicoPlantilla.mockResolvedValue(updatedTopico);
            const result = await topicosService.updateTopicoPlantilla(1, updateData);
            expect(result.titulo).toBe('Solo título actualizado');
            expect(result.duracion_estimada).toBe(60);
        });
        it('debe actualizar el estado publicado', async () => {
            const updateData = { publicado: true };
            const existingTopico = {
                id: 1,
                titulo: 'Tópico',
                publicado: false
            };
            const updatedTopico = { ...existingTopico, publicado: true };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.updateTopicoPlantilla.mockResolvedValue(updatedTopico);
            const result = await topicosService.updateTopicoPlantilla(1, updateData);
            expect(result.publicado).toBe(true);
        });
        it('debe lanzar error si el tópico no existe', async () => {
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(null);
            await expect(topicosService.updateTopicoPlantilla(999, { titulo: 'Nuevo título' })).rejects.toThrow('Tópico no encontrado');
            expect(topicos_plantilla_repository_1.default.updateTopicoPlantilla).not.toHaveBeenCalled();
        });
        it('debe incrementar la versión al actualizar', async () => {
            const updateData = { titulo: 'Título actualizado' };
            const existingTopico = {
                id: 1,
                titulo: 'Título original',
                version: 1
            };
            const updatedTopico = {
                ...existingTopico,
                ...updateData,
                version: 2
            };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.updateTopicoPlantilla.mockResolvedValue(updatedTopico);
            const result = await topicosService.updateTopicoPlantilla(1, updateData);
            expect(result.version).toBe(2);
        });
    });
    describe('deleteTopicoPlantilla', () => {
        it('debe realizar soft delete de un tópico', async () => {
            const existingTopico = {
                id: 1,
                titulo: 'Tópico',
                activo: true
            };
            const deletedTopico = {
                ...existingTopico,
                activo: false
            };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.deleteTopicoPlantilla.mockResolvedValue(deletedTopico);
            const result = await topicosService.deleteTopicoPlantilla(1);
            expect(topicos_plantilla_repository_1.default.getTopicoPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.deleteTopicoPlantilla).toHaveBeenCalledWith(1);
            expect(result.activo).toBe(false);
        });
        it('debe lanzar error si el tópico no existe', async () => {
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(null);
            await expect(topicosService.deleteTopicoPlantilla(999)).rejects.toThrow('Tópico no encontrado');
            expect(topicos_plantilla_repository_1.default.deleteTopicoPlantilla).not.toHaveBeenCalled();
        });
        it('debe lanzar error si el tópico ya está inactivo', async () => {
            const inactiveTopico = {
                id: 1,
                titulo: 'Tópico',
                activo: false
            };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(inactiveTopico);
            await expect(topicosService.deleteTopicoPlantilla(1)).rejects.toThrow('El tópico ya está inactivo');
            expect(topicos_plantilla_repository_1.default.deleteTopicoPlantilla).not.toHaveBeenCalled();
        });
    });
});
