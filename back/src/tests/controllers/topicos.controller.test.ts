import { Request, Response } from 'express';
import * as topicosController from '../../controllers/topicos.controller';
import * as topicosService from '../../services/topicos.service';
import * as unidadesRepository from '../../repositories/unidades.repository';
import { ApiResponse } from '../../utils/apiResponse';
import { RolesEnum } from '../../types/roles';

jest.mock('../../services/topicos.service');
jest.mock('../../repositories/unidades.repository');

describe('Topicos Controller', () => {
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

  describe('getTopicosByUnidad', () => {
    it('debe obtener tópicos por unidad exitosamente', async () => {
      const mockUnidad = { id: 1, titulo: 'Unidad 1' };
      const mockTopicos = [
        { id: 1, titulo: 'Tópico 1', orden: 1 },
        { id: 2, titulo: 'Tópico 2', orden: 2 }
      ];

      mockRequest.params = { id_unidad: '1' };
      (unidadesRepository.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (topicosService.getTopicosByUnidad as jest.Mock).mockResolvedValue(mockTopicos);

      await topicosController.getTopicosByUnidad(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(unidadesRepository.getUnidadById).toHaveBeenCalledWith(1);
      expect(topicosService.getTopicosByUnidad).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, mockTopicos)
      );
    });

    it('debe fallar si la unidad no existe', async () => {
      mockRequest.params = { id_unidad: '999' };
      (unidadesRepository.getUnidadById as jest.Mock).mockResolvedValue(null);

      await topicosController.getTopicosByUnidad(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Unidad no encontrada')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id_unidad: '1' };
      (unidadesRepository.getUnidadById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.getTopicosByUnidad(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al obtener los tópicos')
      );
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
      (topicosService.getTopicoById as jest.Mock).mockResolvedValue(mockTopico);

      await topicosController.getTopicoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(topicosService.getTopicoById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, mockTopico)
      );
    });

    it('debe fallar si el tópico no existe', async () => {
      mockRequest.params = { id: '999' };
      (topicosService.getTopicoById as jest.Mock).mockRejectedValue(
        new Error('Tópico no encontrado')
      );

      await topicosController.getTopicoById(
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
      (topicosService.getTopicoById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.getTopicoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al obtener el tópico')
      );
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
      (unidadesRepository.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (topicosService.createTopico as jest.Mock).mockResolvedValue(createdTopico);

      await topicosController.createTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(unidadesRepository.getUnidadById).toHaveBeenCalledWith(1);
      expect(topicosService.createTopico).toHaveBeenCalledWith({
        id_unidad: 1,
        ...topicoData
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, createdTopico)
      );
    });

    it('debe fallar cuando falta el título', async () => {
      mockRequest.params = { id_unidad: '1' };
      mockRequest.body = {
        descripcion: 'Descripción',
        duracion_estimada: 60
      };

      await topicosController.createTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Título y duración estimada son requeridos')
      );
    });

    it('debe fallar cuando falta duracion_estimada', async () => {
      mockRequest.params = { id_unidad: '1' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción'
      };

      await topicosController.createTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Título y duración estimada son requeridos')
      );
    });

    it('debe fallar si la unidad no existe', async () => {
      mockRequest.params = { id_unidad: '999' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60
      };

      (unidadesRepository.getUnidadById as jest.Mock).mockResolvedValue(null);

      await topicosController.createTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Unidad no encontrada')
      );
    });

    it('debe manejar errores del servidor', async () => {
      mockRequest.params = { id_unidad: '1' };
      mockRequest.body = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60
      };

      (unidadesRepository.getUnidadById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.createTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al crear el tópico')
      );
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
      (topicosService.updateTopico as jest.Mock).mockResolvedValue(updatedTopico);

      await topicosController.updateTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(topicosService.updateTopico).toHaveBeenCalledWith(1, updateData);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, updatedTopico)
      );
    });

    it('debe fallar si no hay datos para actualizar', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};

      await topicosController.updateTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'No hay datos para actualizar')
      );
    });

    it('debe fallar si el tópico no existe', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { titulo: 'Nuevo título' };

      (topicosService.updateTopico as jest.Mock).mockRejectedValue(
        new Error('Tópico no encontrado')
      );

      await topicosController.updateTopico(
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

      (topicosService.updateTopico as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.updateTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(false, null, 'Error al actualizar el tópico')
      );
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
      (topicosService.deleteTopico as jest.Mock).mockResolvedValue(deletedTopico);

      await topicosController.deleteTopico(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(topicosService.deleteTopico).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(
        new ApiResponse(true, deletedTopico, 'Tópico eliminado correctamente')
      );
    });

    it('debe fallar si el tópico no existe', async () => {
      mockRequest.params = { id: '999' };

      (topicosService.deleteTopico as jest.Mock).mockRejectedValue(
        new Error('Tópico no encontrado')
      );

      await topicosController.deleteTopico(
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

      (topicosService.deleteTopico as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await topicosController.deleteTopico(
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
