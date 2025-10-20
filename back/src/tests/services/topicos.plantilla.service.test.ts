// back/src/tests/services/topicos.plantilla.service.test.ts

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


import * as topicosService from '../../services/topicos.plantilla.service';
import topicosRepository from '../../repositories/topicos.plantilla.repository';


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

      (topicosRepository.getTopicosByUnidadPlantilla as jest.Mock).mockResolvedValue(mockTopicos);

      const result = await topicosService.getTopicosByUnidadPlantilla(1);

      expect(topicosRepository.getTopicosByUnidadPlantilla).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTopicos);
      expect(result).toHaveLength(2);
    });

    it('debe retornar array vacío si no hay tópicos', async () => {
      (topicosRepository.getTopicosByUnidadPlantilla as jest.Mock).mockResolvedValue([]);

      const result = await topicosService.getTopicosByUnidadPlantilla(999);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe lanzar error si falla la consulta', async () => {
      (topicosRepository.getTopicosByUnidadPlantilla as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(
        topicosService.getTopicosByUnidadPlantilla(1)
      ).rejects.toThrow('Database connection error');
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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(mockTopico);

      const result = await topicosService.getTopicoPlantillaById(1);

      expect(topicosRepository.getTopicoPlantillaById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTopico);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(null);

      await expect(
        topicosService.getTopicoPlantillaById(999)
      ).rejects.toThrow('Tópico no encontrado');
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
      (topicosRepository.getMaxOrden as jest.Mock).mockResolvedValue(2);
      (topicosRepository.createTopicoPlantilla as jest.Mock).mockResolvedValue(createdTopico);

      const result = await topicosService.createTopicoPlantilla(1, topicoData);

      expect(topicosRepository.getMaxOrden).toHaveBeenCalledWith(1);
      expect(topicosRepository.createTopicoPlantilla).toHaveBeenCalledWith({
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

      (topicosRepository.getMaxOrden as jest.Mock).mockResolvedValue(0);
      (topicosRepository.createTopicoPlantilla as jest.Mock).mockResolvedValue(createdTopico);

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

      (topicosRepository.getMaxOrden as jest.Mock).mockResolvedValue(0);
      (topicosRepository.createTopicoPlantilla as jest.Mock).mockResolvedValue(createdTopico);

      const result = await topicosService.createTopicoPlantilla(1, topicoData);

      expect(result.objetivos_aprendizaje).toBe('Aprender conceptos básicos');
    });

    it('debe lanzar error si falla la creación', async () => {
      const topicoData = {
        titulo: 'Nuevo Tópico',
        duracion_estimada: 60,
        version: 1
      };

      (topicosRepository.getMaxOrden as jest.Mock).mockResolvedValue(0);
      (topicosRepository.createTopicoPlantilla as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        topicosService.createTopicoPlantilla(1, topicoData)
      ).rejects.toThrow('Database error');
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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosRepository.updateTopicoPlantilla as jest.Mock).mockResolvedValue(updatedTopico);

      const result = await topicosService.updateTopicoPlantilla(1, updateData);

      expect(topicosRepository.getTopicoPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosRepository.updateTopicoPlantilla).toHaveBeenCalledWith(1, updateData);
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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosRepository.updateTopicoPlantilla as jest.Mock).mockResolvedValue(updatedTopico);

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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosRepository.updateTopicoPlantilla as jest.Mock).mockResolvedValue(updatedTopico);

      const result = await topicosService.updateTopicoPlantilla(1, updateData);

      expect(result.publicado).toBe(true);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(null);

      await expect(
        topicosService.updateTopicoPlantilla(999, { titulo: 'Nuevo título' })
      ).rejects.toThrow('Tópico no encontrado');

      expect(topicosRepository.updateTopicoPlantilla).not.toHaveBeenCalled();
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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosRepository.updateTopicoPlantilla as jest.Mock).mockResolvedValue(updatedTopico);

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

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(existingTopico);
      (topicosRepository.deleteTopicoPlantilla as jest.Mock).mockResolvedValue(deletedTopico);

      const result = await topicosService.deleteTopicoPlantilla(1);

      expect(topicosRepository.getTopicoPlantillaById).toHaveBeenCalledWith(1);
      expect(topicosRepository.deleteTopicoPlantilla).toHaveBeenCalledWith(1);
      expect(result.activo).toBe(false);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(null);

      await expect(
        topicosService.deleteTopicoPlantilla(999)
      ).rejects.toThrow('Tópico no encontrado');

      expect(topicosRepository.deleteTopicoPlantilla).not.toHaveBeenCalled();
    });

    it('debe lanzar error si el tópico ya está inactivo', async () => {
      const inactiveTopico = {
        id: 1,
        titulo: 'Tópico',
        activo: false
      };

      (topicosRepository.getTopicoPlantillaById as jest.Mock).mockResolvedValue(inactiveTopico);

      await expect(
        topicosService.deleteTopicoPlantilla(1)
      ).rejects.toThrow('El tópico ya está inactivo');

      expect(topicosRepository.deleteTopicoPlantilla).not.toHaveBeenCalled();
    });
  });
});