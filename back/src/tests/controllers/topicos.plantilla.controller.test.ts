// back/src/tests/controllers/topicos.plantilla.controller.test.ts
import { Request, Response } from 'express';
import * as topicosController from '../../controllers/topicos.plantilla.controller';
import topicosPlantillaRepository from '../../repositories/topicos.plantilla.repository';
import * as unidadesPlantillaRepository from '../../repositories/unidades.plantilla.repository';
import { ApiResponse } from '../../utils/apiResponse';
import { RolesEnum } from '../../types/roles';

jest.mock('../../repositories/topicos.plantilla.repository');
jest.mock('../../repositories/unidades.plantilla.repository');

describe('Topicos Plantilla Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      body: {},
      params: {},
      user: { id: 1, email: 'admin@test.com', rol: RolesEnum.ADMIN } as any
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
      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockResolvedValue(mockUnidad);
      (topicosPlantillaRepository.getTopicosByUnidadPlantilla as jest.Mock).mockResolvedValue(mockTopicos);

      await topicosController.getTopicosByUnidadPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(unidadesPlantillaRepository.getUnidadPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosPlantillaRepository.getTopicosByUnidadPlantilla).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, mockTopicos)
      );
    });

    it('debe fallar si la unidad plantilla no existe', async () => {
      mockRequest.params = { id_unidad_plantilla: '999' };
      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockResolvedValue(null);

      await topicosController.getTopicosByUnidadPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Unidad plantilla no encontrada')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id_unidad_plantilla: '1' };
      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.getTopicosByUnidadPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al obtener los tópicos')
      );
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
      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockResolvedValue(mockUnidad);
      (topicosPlantillaRepository.getMaxOrden as jest.Mock).mockResolvedValue(0);
      (topicosPlantillaRepository.createTopicoPlantilla as jest.Mock).mockResolvedValue(createdTopico);

      await topicosController.createTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(unidadesPlantillaRepository.getUnidadPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosPlantillaRepository.getMaxOrden).toHaveBeenCalledWith(1);
      expect(topicosPlantillaRepository.createTopicoPlantilla).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, createdTopico)
      );
    });

    it('debe fallar cuando falta el título', async () => {
      mockRequest.params = { id_unidad_plantilla: '1' };
      mockRequest.body = {
        descripcion: 'Descripción',
        duracion_estimada: 60
      };

      await topicosController.createTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Título y duración estimada son requeridos')
      );
    });

    it('debe fallar cuando falta duracion_estimada', async () => {
      mockRequest.params = { id_unidad_plantilla: '1' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción'
      };

      await topicosController.createTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Título y duración estimada son requeridos')
      );
    });

    it('debe fallar si la unidad plantilla no existe', async () => {
      mockRequest.params = { id_unidad_plantilla: '999' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60
      };

      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockResolvedValue(null);

      await topicosController.createTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Unidad plantilla no encontrada')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id_unidad_plantilla: '1' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60
      };

      (unidadesPlantillaRepository.getUnidadPlantillaById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.createTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al crear el tópico')
      );
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
      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosPlantillaRepository.updateTopicoPlantilla as jest.Mock).mockResolvedValue(updatedTopico);

      await topicosController.updateTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(topicosPlantillaRepository.getTopicoPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosPlantillaRepository.updateTopicoPlantilla).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, updatedTopico)
      );
    });

    it('debe fallar si el tópico no existe', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { titulo: 'Nuevo título' };

      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(null);

      await topicosController.updateTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Tópico no encontrado')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { titulo: 'Nuevo título' };

      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.updateTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al actualizar el tópico')
      );
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
      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosPlantillaRepository.deleteTopicoPlantilla as jest.Mock).mockResolvedValue(null);

      await topicosController.deleteTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(topicosPlantillaRepository.getTopicoPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosPlantillaRepository.deleteTopicoPlantilla).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, null, 'Tópico plantilla eliminado correctamente')
      );
    });

    it('debe fallar si el tópico no existe', async () => {
      mockRequest.params = { id: '999' };

      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(null);

      await topicosController.deleteTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Tópico no encontrado')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id: '1' };

      (topicosPlantillaRepository.getTopicoPlantillaById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.deleteTopicoPlantilla(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al eliminar el tópico')
      );
    });
  });
});