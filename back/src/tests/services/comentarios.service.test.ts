import * as comentarioService from '../../services/comentarios.service';
import * as comentarioRepo from '../../repositories/comentarios.repository';
import * as usuarioRepo from '../../repositories/usuarios.repository';
import * as topicoRepo from '../../repositories/topicos.repository';
import { ComentarioCreate, ComentarioResponse, ComentarioRequest } from '../../types/comentarios.types';

jest.mock('../../repositories/comentarios.repository');
jest.mock('../../repositories/usuarios.repository');
jest.mock('../../repositories/topicos.repository');

describe('Comentarios Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock por defecto: ambos existen
    (topicoRepo.getTopicoById as jest.Mock).mockResolvedValue({ id: 1, titulo: 'Topico 1' });
    (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 10, nombre: 'Hans' });
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

    it('C2: No se puede publicar comentarios vacíos', async () => {
      await expect(
        comentarioService.createComentario({ ...baseData, texto: '' })
      ).rejects.toMatchObject({ status: 400, message: 'No se puede publicar comentarios vacios' });
    });

    it('C3: Falta id_topico', async () => {
      await expect(
        comentarioService.createComentario({ ...baseData, id_topico: null } as any)
      ).rejects.toMatchObject({ status: 400, message: 'El topico es obligatorio' });
    });

    it('C4: Falta id_usuario', async () => {
      await expect(
        comentarioService.createComentario({ ...baseData, id_usuario: null } as any)
      ).rejects.toMatchObject({ status: 400, message: 'Usuario no reconocido' });
    });

    it('C5: Topico no encontrado', async () => {
      (topicoRepo.getTopicoById as jest.Mock).mockResolvedValue(null);

      await expect(comentarioService.createComentario(baseData))
        .rejects.toMatchObject({ status: 404, message: 'Topico no encontrado' });
    });

    it('C6: Usuario no encontrado', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue(null);

      await expect(comentarioService.createComentario(baseData))
        .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
    });

    it('C7: Error interno del repositorio', async () => {
      (comentarioRepo.createComentario as jest.Mock).mockRejectedValue(new Error('Error al crear comentario'));

      await expect(comentarioService.createComentario(baseData))
        .rejects.toThrow('Error al crear comentario');
    });
  });

  // TEST - OBTENER COMENTARIOS POR TÓPICO
  describe('getComentariosByTopico', () => {
    const baseRequest: ComentarioRequest = {
      id_topico: 1,
      id_usuario: 10
    };

    it('C8: Listar comentarios de un tópico existente', async () => {
      const mockComentarios: ComentarioResponse[] = [
        { id_topico: 1, id_usuario: 2, texto: 'Muy buen aporte', visto: false, fecha_publicacion: '2025-11-10T12:00:00Z' },
        { id_topico: 1, id_usuario: 3, texto: 'Estoy de acuerdo', visto: true, fecha_publicacion: '2025-11-11T09:00:00Z' }
      ];

      (comentarioRepo.getComentariosByTopico as jest.Mock).mockResolvedValue(mockComentarios);

      const result = await comentarioService.getComentariosByTopico(baseRequest);

      expect(result).toEqual(mockComentarios);
      expect(comentarioRepo.getComentariosByTopico).toHaveBeenCalledWith(baseRequest);
    });

    it('C9: Falta id_topico', async () => {
      await expect(
        comentarioService.getComentariosByTopico({ id_usuario: 10 } as any)
      ).rejects.toMatchObject({ status: 400, message: 'El topico es obligatorio' });
    });

    it('C10: Falta id_usuario', async () => {
      await expect(
        comentarioService.getComentariosByTopico({ id_topico: 1 } as any)
      ).rejects.toMatchObject({ status: 400, message: 'Usuario no reconocido' });
    });

    it('C11: Topico no encontrado', async () => {
      (topicoRepo.getTopicoById as jest.Mock).mockResolvedValue(null);

      await expect(comentarioService.getComentariosByTopico(baseRequest))
        .rejects.toMatchObject({ status: 404, message: 'Topico no encontrado' });
    });

    it('C12: Usuario no encontrado', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue(null);

      await expect(comentarioService.getComentariosByTopico(baseRequest))
        .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
    });

    it('C13: Tópico sin comentarios', async () => {
      (comentarioRepo.getComentariosByTopico as jest.Mock).mockResolvedValue([]);

      const result = await comentarioService.getComentariosByTopico(baseRequest);

      expect(result).toEqual([]);
      expect(comentarioRepo.getComentariosByTopico).toHaveBeenCalledWith(baseRequest);
    });
  });
});
