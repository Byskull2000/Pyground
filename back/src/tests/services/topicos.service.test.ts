import * as topicosService from '../../services/topicos.service';
import * as topicosRepository from '../../repositories/topicos.repository';
import * as unidadesRepository from '../../repositories/unidades.repository';

jest.mock('../../repositories/topicos.repository');
jest.mock('../../repositories/unidades.repository');

describe('Topicos Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopicosByUnidad', () => {
    it('debe retornar tópicos de una unidad', async () => {
      const mockTopicos = [
        {
          id: 1,
          id_unidad: 1,
          titulo: 'Tópico 1',
          descripcion: 'Descripción 1',
          duracion_estimada: 60,
          orden: 1,
          activo: true,
        },
      ];

      (topicosRepository.getTopicosByUnidad as jest.Mock).mockResolvedValue(mockTopicos);

      const result = await topicosService.getTopicosByUnidad(1);

      expect(topicosRepository.getTopicosByUnidad).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTopicos);
    });
  });

  describe('getTopicoById', () => {
    it('debe retornar un tópico por ID', async () => {
      const mockTopico = {
        id: 1,
        id_unidad: 1,
        titulo: 'Tópico 1',
        descripcion: 'Descripción 1',
        duracion_estimada: 60,
        orden: 1,
        activo: true,
      };

      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(mockTopico);

      const result = await topicosService.getTopicoById(1);

      expect(topicosRepository.getTopicoById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTopico);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(null);

      await expect(topicosService.getTopicoById(1)).rejects.toThrow('Tópico no encontrado');
    });
  });

  describe('createTopico', () => {
    it('debe crear un tópico con orden automático', async () => {
      const mockTopicos = [
        { orden: 1 },
        { orden: 2 },
      ];

      const mockCreatedTopico = {
        id: 1,
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
        orden: 3,
        activo: true,
      };

      (topicosRepository.getTopicosByUnidad as jest.Mock).mockResolvedValue(mockTopicos);
      (topicosRepository.createTopico as jest.Mock).mockResolvedValue(mockCreatedTopico);

      const data = {
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
      };

      const result = await topicosService.createTopico(data);

      expect(topicosRepository.getTopicosByUnidad).toHaveBeenCalledWith(1);
      expect(topicosRepository.createTopico).toHaveBeenCalledWith({
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
        orden: 3,
        publicado: false,
        objetivos_aprendizaje: undefined,
        activo: true,
        id_topico_plantilla: undefined,
      });
      expect(result).toEqual(mockCreatedTopico);
    });

    it('debe crear un tópico con orden especificado', async () => {
      const mockCreatedTopico = {
        id: 1,
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
        orden: 5,
        activo: true,
      };

      (topicosRepository.createTopico as jest.Mock).mockResolvedValue(mockCreatedTopico);

      const data = {
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
        orden: 5,
      };

      const result = await topicosService.createTopico(data);

      expect(topicosRepository.getTopicosByUnidad).not.toHaveBeenCalled();
      expect(topicosRepository.createTopico).toHaveBeenCalledWith({
        id_unidad: 1,
        titulo: 'Nuevo Tópico',
        descripcion: 'Descripción',
        duracion_estimada: 60,
        orden: 5,
        publicado: false,
        objetivos_aprendizaje: undefined,
        activo: true,
        id_topico_plantilla: undefined,
      });
      expect(result).toEqual(mockCreatedTopico);
    });
  });

  describe('updateTopico', () => {
    it('debe actualizar un tópico existente', async () => {
      const mockTopico = {
        id: 1,
        titulo: 'Tópico Original',
        descripcion: 'Descripción Original',
      };

      const mockUpdatedTopico = {
        id: 1,
        titulo: 'Tópico Actualizado',
        descripcion: 'Descripción Actualizada',
      };

      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(mockTopico);
      (topicosRepository.updateTopico as jest.Mock).mockResolvedValue(mockUpdatedTopico);

      const result = await topicosService.updateTopico(1, {
        titulo: 'Tópico Actualizado',
        descripcion: 'Descripción Actualizada',
      });

      expect(topicosRepository.getTopicoById).toHaveBeenCalledWith(1);
      expect(topicosRepository.updateTopico).toHaveBeenCalledWith(1, {
        titulo: 'Tópico Actualizado',
        descripcion: 'Descripción Actualizada',
        fecha_actualizacion: expect.any(Date),
      });
      expect(result).toEqual(mockUpdatedTopico);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(null);

      await expect(topicosService.updateTopico(1, { titulo: 'Nuevo Título' })).rejects.toThrow('Tópico no encontrado');
    });
  });

  describe('deleteTopico', () => {
    it('debe eliminar un tópico (soft delete)', async () => {
      const mockTopico = {
        id: 1,
        activo: true,
      };

      const mockDeletedTopico = {
        id: 1,
        activo: false,
      };

      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(mockTopico);
      (topicosRepository.deleteTopico as jest.Mock).mockResolvedValue(mockDeletedTopico);

      const result = await topicosService.deleteTopico(1);

      expect(topicosRepository.getTopicoById).toHaveBeenCalledWith(1);
      expect(topicosRepository.deleteTopico).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDeletedTopico);
    });

    it('debe lanzar error si el tópico no existe', async () => {
      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(null);

      await expect(topicosService.deleteTopico(1)).rejects.toThrow('Tópico no encontrado');
    });

    it('debe lanzar error si el tópico ya está inactivo', async () => {
      const mockTopico = {
        id: 1,
        activo: false,
      };

      (topicosRepository.getTopicoById as jest.Mock).mockResolvedValue(mockTopico);

      await expect(topicosService.deleteTopico(1)).rejects.toThrow('El tópico ya está inactivo');
    });
  });

  // REORDER TOPICOS
  describe('reorderTopicos', () => {
    it('T20: reordenamiento exitoso', async () => {
      const topicosInput = [{ id: 2, orden: 1 }, { id: 1, orden: 2 }];
      (topicosRepository.existTopicosByIds as jest.Mock).mockResolvedValue([1, 2]);
      (topicosRepository.reorderTopicos as jest.Mock).mockResolvedValue(topicosInput);

      const result = await topicosService.reorderTopicos(topicosInput);

      expect(topicosRepository.existTopicosByIds).toHaveBeenCalledWith([2, 1]);
      expect(topicosRepository.reorderTopicos).toHaveBeenCalledWith(topicosInput);
      expect(result).toEqual({ message: 'Topicos reordenados correctamente', count: 2 });
    });

    it('T21: error por array vacío', async () => {
      await expect(topicosService.reorderTopicos([])).rejects.toEqual({ status: 400, message: 'Debe enviar al menos un topico para reordenar' });
    });

    it('T22: error por tópico sin id o sin orden', async () => {
      const invalidInput = [{ id: 1 } as any, { orden: 2 } as any];
      await expect(topicosService.reorderTopicos(invalidInput)).rejects.toEqual({ status: 400, message: 'Cada topico debe tener id y orden válidos' });
    });

    it('T23: error por tópico inexistente', async () => {
      const invalidInput = [{ id: 9999, orden: 1 }];
      (topicosRepository.existTopicosByIds as jest.Mock).mockResolvedValue([]);
      await expect(topicosService.reorderTopicos(invalidInput)).rejects.toEqual({ status: 404, message: 'Uno o más topicos no existen' });
    });
  });
});
