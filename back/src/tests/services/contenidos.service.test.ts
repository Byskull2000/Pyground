import * as contenidosService from '../../services/contenidos.service';
import * as contenidosRepo from '../../repositories/contenidos.repository';
import * as topicosRepo from '../../repositories/topicos.repository';
import { ContenidoCreate } from '../../types/contenidos.types';

jest.mock('../../repositories/contenidos.repository');
jest.mock('../../repositories/topicos.repository');

enum TipoContenidoEnum {
  TEXTO = 'TEXTO',
  IMAGEN = 'IMAGEN',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  ARCHIVO = 'ARCHIVO'
}

describe('Contenidos Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContenidos', () => {
    const topicoMock = { id: 1, nombre: 'Tópico 1' };

    it('CT1: Creación exitosa', async () => {
      const data: ContenidoCreate[] = [
        { tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'Contenido 1' },
        { tipo: TipoContenidoEnum.IMAGEN, orden: 2, enlace_archivo: 'imagen.jpg' }
      ];

      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue(topicoMock);
      (contenidosRepo.createContenidos as jest.Mock).mockResolvedValue([{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }]);

      const result = await contenidosService.createContenidos(1, data);
      expect(result).toEqual([{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }]);
      expect(contenidosRepo.createContenidos).toHaveBeenCalledWith({ id_topico: 1, contenidos: data });
    });

    it('CT2: Falta id_topico', async () => {
      await expect(contenidosService.createContenidos(null as any, [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }]))
        .rejects.toMatchObject({ status: 400, message: 'El id_topico es obligatorio' });
    });

    it('CT3: No hay contenidos', async () => {
      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue(topicoMock);
      await expect(contenidosService.createContenidos(1, []))
        .rejects.toMatchObject({ status: 400, message: 'Debe incluir al menos un contenido' });
    });

    it('CT4: Tópico inexistente', async () => {
      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue(null);
      await expect(contenidosService.createContenidos(9999, [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }]))
        .rejects.toMatchObject({ status: 404, message: 'Tópico no encontrado' });
    });
  });

  describe('updateContenido', () => {
    it('CT5: Actualización exitosa', async () => {
      const contenidoMock = { id: 1, activo: true };
      const data: Partial<ContenidoCreate> = { orden: 2 };
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(contenidoMock);
      (contenidosRepo.updateContenido as jest.Mock).mockResolvedValue({ ...contenidoMock, ...data });

      const result = await contenidosService.updateContenido(1, data);
      expect(result).toEqual({ ...contenidoMock, ...data });
      expect(contenidosRepo.updateContenido).toHaveBeenCalledWith(1, data);
    });

    it('CT6: Contenido inexistente', async () => {
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(null);
      await expect(contenidosService.updateContenido(9999, {} as any))
        .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
    });
  });

  describe('deleteContenido', () => {
    it('CT7: Eliminación exitosa', async () => {
      const contenidoMock = { id: 1, activo: true };
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(contenidoMock);
      (contenidosRepo.deleteContenido as jest.Mock).mockResolvedValue({ ...contenidoMock, activo: false });

      const result = await contenidosService.deleteContenido(1);
      expect(result).toEqual({ ...contenidoMock, activo: false });
      expect(contenidosRepo.deleteContenido).toHaveBeenCalledWith(1);
    });

    it('CT8: Contenido inexistente', async () => {
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(null);
      await expect(contenidosService.deleteContenido(9999))
        .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
    });

    it('CT9: Contenido ya inactivo', async () => {
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue({ id: 1, activo: false });
      await expect(contenidosService.deleteContenido(1))
        .rejects.toMatchObject({ status: 400, message: 'El contenido ya está inactivo' });
    });
  });

  describe('getContenidosByTopico', () => {
    it('CT10: Listar contenidos de un tópico existente', async () => {
      const contenidosMock = [{ id: 1 }, { id: 2 }];
      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue({ id: 1 });
      (contenidosRepo.getContenidosByTopico as jest.Mock).mockResolvedValue(contenidosMock);

      const result = await contenidosService.getContenidosByTopico(1);
      expect(result).toEqual(contenidosMock);
      expect(contenidosRepo.getContenidosByTopico).toHaveBeenCalledWith(1);
    });

    it('CT11: Tópico sin contenidos registrados', async () => {
      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue({ id: 1 });
      (contenidosRepo.getContenidosByTopico as jest.Mock).mockResolvedValue([]);

      const result = await contenidosService.getContenidosByTopico(1);
      expect(result).toEqual([]);
    });

    it('CT12: Tópico inexistente', async () => {
      (topicosRepo.getTopicoById as jest.Mock).mockResolvedValue(null);
      await expect(contenidosService.getContenidosByTopico(9999))
        .rejects.toMatchObject({ status: 404, message: 'Tópico no encontrado' });
    });
  });

  describe('getContenidoById', () => {
    it('CT13: Contenido existente', async () => {
      const contenidoMock = { id: 1 };
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(contenidoMock);

      const result = await contenidosService.getContenidoById(1);
      expect(result).toEqual(contenidoMock);
    });

    it('CT14: Contenido inexistente', async () => {
      (contenidosRepo.getContenidoById as jest.Mock).mockResolvedValue(null);
      await expect(contenidosService.getContenidoById(9999))
        .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
    });
  });

  // TEST - REORDENAMIENTO DE CONTENIDOS
  describe('reorderContenidos', () => {
    const contenidosValidos = [
      { id: 1, orden: 2 },
      { id: 2, orden: 1 },
    ];

    it('CT15: Reordenamiento exitoso', async () => {
      (contenidosRepo.existContenidosByIds as jest.Mock).mockResolvedValue([1, 2]);
      (contenidosRepo.reorderContenidos as jest.Mock).mockResolvedValue(contenidosValidos);

      const result = await contenidosService.reorderContenidos(contenidosValidos);

      expect(result).toEqual({
        message: 'Contenidos reordenados correctamente',
        count: contenidosValidos.length,
      });
      expect(contenidosRepo.reorderContenidos).toHaveBeenCalledWith(contenidosValidos);
    });

    it('CT16: Error por array vacío', async () => {
      await expect(contenidosService.reorderContenidos([]))
        .rejects.toMatchObject({ status: 400, message: 'Debe enviar al menos un contenido para reordenar' });
    });

    it('CT17: Error por contenido sin id o sin orden', async () => {
      const invalidContenidos = [
        { id: 1 } as any, // falta orden
        { orden: 2 } as any, // falta id
      ];
      await expect(contenidosService.reorderContenidos(invalidContenidos))
        .rejects.toMatchObject({ status: 400, message: 'Cada contenido debe tener id y orden válidos' });
    });

    it('CT18: Error por contenido inexistente', async () => {
      const contenidos = [{ id: 1, orden: 1 }, { id: 2, orden: 2 }];
      (contenidosRepo.existContenidosByIds as jest.Mock).mockResolvedValue([1]);

      await expect(contenidosService.reorderContenidos(contenidos))
        .rejects.toMatchObject({ status: 404, message: 'Uno o más contenidos no existen' });
    });

    it('CT19: Error interno del repositorio', async () => {
      (contenidosRepo.existContenidosByIds as jest.Mock).mockResolvedValue([1, 2]);
      (contenidosRepo.reorderContenidos as jest.Mock).mockRejectedValue(new Error('Error al reordenar'));
      
      await expect(contenidosService.reorderContenidos(contenidosValidos))
        .rejects.toThrow('Error al reordenar');
    });
  });


});
