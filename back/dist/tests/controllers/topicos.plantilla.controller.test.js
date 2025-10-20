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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topicosController = __importStar(require("../../controllers/topicos.plantilla.controller"));
const topicos_plantilla_repository_1 = __importDefault(require("../../repositories/topicos.plantilla.repository"));
const unidadesPlantillaRepository = __importStar(require("../../repositories/unidades.plantilla.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const roles_1 = require("../../types/roles");
jest.mock('../../repositories/topicos.plantilla.repository');
jest.mock('../../repositories/unidades.plantilla.repository');
describe('Topicos Plantilla Controller', () => {
    let mockRequest;
    let mockResponse;
    let statusMock;
    let jsonMock;
    beforeEach(() => {
        jest.clearAllMocks();
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRequest = {
            body: {},
            params: {},
            user: { id: 1, email: 'admin@test.com', rol: roles_1.RolesEnum.ADMIN }
        };
        mockResponse = {
            status: statusMock,
            json: jsonMock
        };
    });
    describe('getTopicosByUnidadPlantilla', () => {
        it('debe obtener tópicos por unidad plantilla exitosamente', async () => {
            const mockUnidad = { id: 1, titulo: 'Unidad 1' };
            const mockTopicos = [
                { id: 1, titulo: 'Tópico 1', orden: 1 },
                { id: 2, titulo: 'Tópico 2', orden: 2 }
            ];
            mockRequest.params = { id_unidad_plantilla: '1' };
            unidadesPlantillaRepository.getUnidadPlantillaById.mockResolvedValue(mockUnidad);
            topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla.mockResolvedValue(mockTopicos);
            await topicosController.getTopicosByUnidadPlantilla(mockRequest, mockResponse);
            expect(unidadesPlantillaRepository.getUnidadPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockTopicos));
        });
        it('debe fallar si la unidad plantilla no existe', async () => {
            mockRequest.params = { id_unidad_plantilla: '999' };
            unidadesPlantillaRepository.getUnidadPlantillaById.mockResolvedValue(null);
            await topicosController.getTopicosByUnidadPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id_unidad_plantilla: '1' };
            unidadesPlantillaRepository.getUnidadPlantillaById.mockRejectedValue(new Error('Database error'));
            await topicosController.getTopicosByUnidadPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener los tópicos'));
        });
    });
    describe('createTopicoPlantilla', () => {
        it('debe crear un tópico plantilla exitosamente', async () => {
            const mockUnidad = { id: 1, titulo: 'Unidad 1' };
            const topicoData = {
                titulo: 'Nuevo Tópico',
                descripcion: 'Descripción test',
                duracion_estimada: 60,
                objetivos_aprendizaje: 'Objetivos'
            };
            const createdTopico = {
                id: 1,
                ...topicoData,
                id_unidad_plantilla: 1,
                orden: 1,
                version: 1,
                activo: true
            };
            mockRequest.params = { id_unidad_plantilla: '1' };
            mockRequest.body = topicoData;
            unidadesPlantillaRepository.getUnidadPlantillaById.mockResolvedValue(mockUnidad);
            topicos_plantilla_repository_1.default.getMaxOrden.mockResolvedValue(0);
            topicos_plantilla_repository_1.default.createTopicoPlantilla.mockResolvedValue(createdTopico);
            await topicosController.createTopicoPlantilla(mockRequest, mockResponse);
            expect(unidadesPlantillaRepository.getUnidadPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.getMaxOrden).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.createTopicoPlantilla).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, createdTopico));
        });
        it('debe fallar cuando falta el título', async () => {
            mockRequest.params = { id_unidad_plantilla: '1' };
            mockRequest.body = {
                descripcion: 'Descripción',
                duracion_estimada: 60
            };
            await topicosController.createTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        });
        it('debe fallar cuando falta duracion_estimada', async () => {
            mockRequest.params = { id_unidad_plantilla: '1' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                descripcion: 'Descripción'
            };
            await topicosController.createTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        });
        it('debe fallar si la unidad plantilla no existe', async () => {
            mockRequest.params = { id_unidad_plantilla: '999' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                duracion_estimada: 60
            };
            unidadesPlantillaRepository.getUnidadPlantillaById.mockResolvedValue(null);
            await topicosController.createTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad plantilla no encontrada'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id_unidad_plantilla: '1' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                duracion_estimada: 60
            };
            unidadesPlantillaRepository.getUnidadPlantillaById.mockRejectedValue(new Error('Database error'));
            await topicosController.createTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al crear el tópico'));
        });
    });
    describe('updateTopicoPlantilla', () => {
        it('debe actualizar un tópico plantilla exitosamente', async () => {
            const updateData = {
                titulo: 'Tópico Actualizado',
                duracion_estimada: 90
            };
            const existingTopico = {
                id: 1,
                titulo: 'Tópico Original',
                duracion_estimada: 60,
                version: 1
            };
            const updatedTopico = {
                ...existingTopico,
                ...updateData,
                version: 2
            };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.updateTopicoPlantilla.mockResolvedValue(updatedTopico);
            await topicosController.updateTopicoPlantilla(mockRequest, mockResponse);
            expect(topicos_plantilla_repository_1.default.getTopicoPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.updateTopicoPlantilla).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updatedTopico));
        });
        it('debe fallar si el tópico no existe', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { titulo: 'Nuevo título' };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(null);
            await topicosController.updateTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { titulo: 'Nuevo título' };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockRejectedValue(new Error('Database error'));
            await topicosController.updateTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al actualizar el tópico'));
        });
    });
    describe('deleteTopicoPlantilla', () => {
        it('debe eliminar un tópico plantilla exitosamente (soft delete)', async () => {
            const existingTopico = {
                id: 1,
                titulo: 'Tópico',
                activo: true
            };
            mockRequest.params = { id: '1' };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(existingTopico);
            topicos_plantilla_repository_1.default.deleteTopicoPlantilla.mockResolvedValue(null);
            await topicosController.deleteTopicoPlantilla(mockRequest, mockResponse);
            expect(topicos_plantilla_repository_1.default.getTopicoPlantillaById).toHaveBeenCalledWith(1);
            expect(topicos_plantilla_repository_1.default.deleteTopicoPlantilla).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, null, 'Tópico plantilla eliminado correctamente'));
        });
        it('debe fallar si el tópico no existe', async () => {
            mockRequest.params = { id: '999' };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockResolvedValue(null);
            await topicosController.deleteTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id: '1' };
            topicos_plantilla_repository_1.default.getTopicoPlantillaById.mockRejectedValue(new Error('Database error'));
            await topicosController.deleteTopicoPlantilla(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al eliminar el tópico'));
        });
    });
});
