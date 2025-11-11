import * as comentarioService from '../../services/comentarios.service';
import * as comentarioRepo from '../../repositories/comentarios.repository';
import { ComentarioCreate, ComentarioResponse } from '../../types/comentarios.types';

jest.mock('../../repositories/comentarios.repository');

describe('Comentarios Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST - CREACIÓN DE COMENTARIO
  describe('createComentario', () => {
    const baseData: ComentarioCreate = {
      id_topico: 1,
      id_usuario: 5,
      texto: 'Buen aporte'
    };

    it('C1: Creación exitosa', async () => {
      const mockComentario: ComentarioResponse = {
        ...baseData,
        visto: false,
        fecha_publicacion: new Date().toISOString()
      };

      (comentarioRepo.createComentario as jest.Mock).mockResolvedValue(mockComentario);

      const result = await comentarioService.createComentario(baseData);

      expect(result).toEqual(mockComentario);
      expect(comentarioRepo.createComentario).toHaveBeenCalledWith(baseData);
    });

    it('C2: Faltan campos obligatorios: texto', async () => {
      await expect(
        comentarioService.createComentario({ ...baseData, texto: '' })
      ).rejects.toThrow('Faltan datos obligatorios para crear el comentario');
    });

    it('C3: Error interno del repositorio', async () => {
      (comentarioRepo.createComentario as jest.Mock).mockRejectedValue(new Error('Error al crear comentario'));

      await expect(comentarioService.createComentario(baseData))
        .rejects.toThrow('Error al crear comentario');
    });
  });

  // TEST - OBTENER COMENTARIOS POR TÓPICO
  describe('getComentariosByTopico', () => {
    it('C4: Listar comentarios de un tópico existente', async () => {
      const mockComentarios = [
        { id_topico: 1, id_usuario: 2, texto: 'Muy buen aporte', visto: false, fecha_publicacion: '2025-11-10T12:00:00Z' },
        { id_topico: 1, id_usuario: 3, texto: 'Estoy de acuerdo', visto: true, fecha_publicacion: '2025-11-11T09:00:00Z' }
      ];
      (comentarioRepo.getComentariosByTopico as jest.Mock).mockResolvedValue(mockComentarios);

      const result = await comentarioService.getComentariosByTopico(1);

      expect(result).toEqual(mockComentarios);
      expect(comentarioRepo.getComentariosByTopico).toHaveBeenCalledWith(1);
    });

    it('C5: Tópico sin comentarios', async () => {
      (comentarioRepo.getComentariosByTopico as jest.Mock).mockResolvedValue([]);
      const result = await comentarioService.getComentariosByTopico(99);
      expect(result).toEqual([]);
    });
  });

  // TEST - OBTENER COMENTARIO POR ID
  describe('getComentarioById', () => {
    it('C6: Consulta exitosa', async () => {
      const mockComentario = {
        id_topico: 1,
        id_usuario: 10,
        texto: 'Interesante punto',
        visto: true,
        fecha_publicacion: '2025-11-10T15:00:00Z'
      };
      (comentarioRepo.getComentarioById as jest.Mock).mockResolvedValue(mockComentario);

      const result = await comentarioService.getComentarioById(1);

      expect(result).toEqual(mockComentario);
      expect(comentarioRepo.getComentarioById).toHaveBeenCalledWith(1);
    });

    it('C7: Comentario inexistente', async () => {
      (comentarioRepo.getComentarioById as jest.Mock).mockResolvedValue(null);

      await expect(comentarioService.getComentarioById(999))
        .rejects.toThrow('Comentario no encontrado');
    });
  });
});
