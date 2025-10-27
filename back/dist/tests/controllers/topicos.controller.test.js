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
const topicosController = __importStar(require("../../controllers/topicos.controller"));
const topicosService = __importStar(require("../../services/topicos.service"));
const unidadesRepository = __importStar(require("../../repositories/unidades.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const roles_1 = require("../../types/roles");
jest.mock('../../services/topicos.service');
jest.mock('../../repositories/unidades.repository');
describe('Topicos Controller', () => {
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
    describe('getTopicosByUnidad', () => {
        it('debe obtener tópicos por unidad exitosamente', async () => {
            const mockUnidad = { id: 1, titulo: 'Unidad 1' };
            const mockTopicos = [
                { id: 1, titulo: 'Tópico 1', orden: 1 },
                { id: 2, titulo: 'Tópico 2', orden: 2 }
            ];
            mockRequest.params = { id_unidad: '1' };
            unidadesRepository.getUnidadById.mockResolvedValue(mockUnidad);
            topicosService.getTopicosByUnidad.mockResolvedValue(mockTopicos);
            await topicosController.getTopicosByUnidad(mockRequest, mockResponse);
            expect(unidadesRepository.getUnidadById).toHaveBeenCalledWith(1);
            expect(topicosService.getTopicosByUnidad).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockTopicos));
        });
        it('debe fallar si la unidad no existe', async () => {
            mockRequest.params = { id_unidad: '999' };
            unidadesRepository.getUnidadById.mockResolvedValue(null);
            await topicosController.getTopicosByUnidad(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id_unidad: '1' };
            unidadesRepository.getUnidadById.mockRejectedValue(new Error('Database error'));
            await topicosController.getTopicosByUnidad(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener los tópicos'));
        });
    });
    describe('getTopicoById', () => {
        it('debe obtener un tópico por ID exitosamente', async () => {
            const mockTopico = {
                id: 1,
                titulo: 'Tópico 1',
                descripcion: 'Descripción',
                duracion_estimada: 60
            };
            mockRequest.params = { id: '1' };
            topicosService.getTopicoById.mockResolvedValue(mockTopico);
            await topicosController.getTopicoById(mockRequest, mockResponse);
            expect(topicosService.getTopicoById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, mockTopico));
        });
        it('debe fallar si el tópico no existe', async () => {
            mockRequest.params = { id: '999' };
            topicosService.getTopicoById.mockRejectedValue(new Error('Tópico no encontrado'));
            await topicosController.getTopicoById(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id: '1' };
            topicosService.getTopicoById.mockRejectedValue(new Error('Database error'));
            await topicosController.getTopicoById(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al obtener el tópico'));
        });
    });
    describe('createTopico', () => {
        it('debe crear un tópico exitosamente', async () => {
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
                id_unidad: 1,
                orden: 1,
                activo: true
            };
            mockRequest.params = { id_unidad: '1' };
            mockRequest.body = topicoData;
            unidadesRepository.getUnidadById.mockResolvedValue(mockUnidad);
            topicosService.createTopico.mockResolvedValue(createdTopico);
            await topicosController.createTopico(mockRequest, mockResponse);
            expect(unidadesRepository.getUnidadById).toHaveBeenCalledWith(1);
            expect(topicosService.createTopico).toHaveBeenCalledWith({
                id_unidad: 1,
                ...topicoData
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, createdTopico));
        });
        it('debe fallar cuando falta el título', async () => {
            mockRequest.params = { id_unidad: '1' };
            mockRequest.body = {
                descripcion: 'Descripción',
                duracion_estimada: 60
            };
            await topicosController.createTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        });
        it('debe fallar cuando falta duracion_estimada', async () => {
            mockRequest.params = { id_unidad: '1' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                descripcion: 'Descripción'
            };
            await topicosController.createTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Título y duración estimada son requeridos'));
        });
        it('debe fallar si la unidad no existe', async () => {
            mockRequest.params = { id_unidad: '999' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                duracion_estimada: 60
            };
            unidadesRepository.getUnidadById.mockResolvedValue(null);
            await topicosController.createTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Unidad no encontrada'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id_unidad: '1' };
            mockRequest.body = {
                titulo: 'Nuevo Tópico',
                duracion_estimada: 60
            };
            unidadesRepository.getUnidadById.mockRejectedValue(new Error('Database error'));
            await topicosController.createTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al crear el tópico'));
        });
    });
    describe('updateTopico', () => {
        it('debe actualizar un tópico exitosamente', async () => {
            const updateData = {
                titulo: 'Tópico Actualizado',
                duracion_estimada: 90
            };
            const updatedTopico = {
                id: 1,
                titulo: 'Tópico Actualizado',
                duracion_estimada: 90,
                descripcion: 'Descripción original'
            };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            topicosService.updateTopico.mockResolvedValue(updatedTopico);
            await topicosController.updateTopico(mockRequest, mockResponse);
            expect(topicosService.updateTopico).toHaveBeenCalledWith(1, updateData);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, updatedTopico));
        });
        it('debe fallar si no hay datos para actualizar', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {};
            await topicosController.updateTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'No hay datos para actualizar'));
        });
        it('debe fallar si el tópico no existe', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { titulo: 'Nuevo título' };
            topicosService.updateTopico.mockRejectedValue(new Error('Tópico no encontrado'));
            await topicosController.updateTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { titulo: 'Nuevo título' };
            topicosService.updateTopico.mockRejectedValue(new Error('Database error'));
            await topicosController.updateTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al actualizar el tópico'));
        });
    });
    describe('deleteTopico', () => {
        it('debe eliminar un tópico exitosamente (soft delete)', async () => {
            const deletedTopico = {
                id: 1,
                titulo: 'Tópico',
                activo: false
            };
            mockRequest.params = { id: '1' };
            topicosService.deleteTopico.mockResolvedValue(deletedTopico);
            await topicosController.deleteTopico(mockRequest, mockResponse);
            expect(topicosService.deleteTopico).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(true, deletedTopico, 'Tópico eliminado correctamente'));
        });
        it('debe fallar si el tópico no existe', async () => {
            mockRequest.params = { id: '999' };
            topicosService.deleteTopico.mockRejectedValue(new Error('Tópico no encontrado'));
            await topicosController.deleteTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Tópico no encontrado'));
        });
        it('debe manejar errores del servidor', async () => {
            mockRequest.params = { id: '1' };
            topicosService.deleteTopico.mockRejectedValue(new Error('Database error'));
            await topicosController.deleteTopico(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith(new apiResponse_1.ApiResponse(false, null, 'Error al eliminar el tópico'));
        });
    });
});
