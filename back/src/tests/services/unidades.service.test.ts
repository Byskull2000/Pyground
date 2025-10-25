import * as unidadService from '../../services/unidades.service';
import * as unidadRepo from '../../repositories/unidades.repository';
import * as edicionRepo from '../../repositories/ediciones.repository';
import { UnidadCreate, UnidadUpdate } from '../../types/unidades.types';

jest.mock('../../repositories/unidades.repository');
jest.mock('../../repositories/ediciones.repository');

describe('Unidad Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, nombre: 'Edición 1' });
  });

  // TEST - REGISTRO DE UNIDAD
  describe('createUnidad', () => {
    const baseData: UnidadCreate = { id_edicion: 1, titulo: 'Introducción', orden: 1 };

    it('U1: Creación exitosa de una unidad', async () => {
      (unidadRepo.getUnidadRedudante as jest.Mock).mockResolvedValue(null);
      const mockNueva = { id: 10, ...baseData, activo: true, estado_publicado: false };
      (unidadRepo.createUnidad as jest.Mock).mockResolvedValue(mockNueva);

      const result = await unidadService.createUnidad(baseData);

      expect(result).toEqual(mockNueva);
      expect(unidadRepo.createUnidad).toHaveBeenCalledWith(baseData);
    });

    it('U2: Faltan campos obligatorios: título', async () => {
      await expect(unidadService.createUnidad({ ...baseData, titulo: '' }))
        .rejects.toMatchObject({ status: 400, message: 'El título es obligatorio' });
    });

    it('U3: Faltan campos obligatorios: id_edicion', async () => {
      await expect(unidadService.createUnidad({ ...baseData, id_edicion: null } as unknown as UnidadCreate))
        .rejects.toMatchObject({ status: 400, message: 'La edición es obligatoria' });
    });

    it('U4: Faltan campos obligatorios: orden', async () => {
      await expect(unidadService.createUnidad({ ...baseData, orden: undefined } as unknown as UnidadCreate))
        .rejects.toMatchObject({ status: 400, message: 'El orden es obligatorio' });
    });

    it('U5: Unidad duplicada en la misma edición', async () => {
      (unidadRepo.getUnidadRedudante as jest.Mock).mockResolvedValue({ id: 1 });
      await expect(unidadService.createUnidad(baseData))
        .rejects.toMatchObject({ status: 409, message: 'Ya existe una unidad con este titulo en este unidad' });
    });

    it('U6: Error interno del repositorio', async () => {
      (unidadRepo.getUnidadRedudante as jest.Mock).mockResolvedValue(null);
      (unidadRepo.createUnidad as jest.Mock).mockRejectedValue(new Error('Error al crear la unidad'));
      await expect(unidadService.createUnidad(baseData))
        .rejects.toThrow('Error al crear la unidad');
    });
  });

  // TEST - ACTUALIZACIÓN DE UNIDAD
  describe('updateUnidad', () => {
    const updateData: UnidadUpdate = { titulo: 'Nuevo Título' };

    it('U7: Actualización exitosa', async () => {
      const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Introducción', activo: true };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      const updatedUnidad = { ...mockUnidad, ...updateData };
      (unidadRepo.updateUnidad as jest.Mock).mockResolvedValue(updatedUnidad);

      const result = await unidadService.updateUnidad(1, updateData);

      expect(result).toEqual(updatedUnidad);
      expect(unidadRepo.updateUnidad).toHaveBeenCalledWith(1, updateData);
    });

    it('U8: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.updateUnidad(9999, updateData))
        .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
    });
  });

  // TEST - ELIMINACIÓN LÓGICA DE UNIDAD
  describe('deleteUnidad', () => {
    it('U9: Eliminación exitosa', async () => {
      const mockUnidad = { id: 1, activo: true };
      const deletedUnidad = { ...mockUnidad, activo: false };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadRepo.deleteUnidad as jest.Mock).mockResolvedValue(deletedUnidad);

      const result = await unidadService.deleteUnidad(1);

      expect(result).toEqual(deletedUnidad);
      expect(unidadRepo.deleteUnidad).toHaveBeenCalledWith(1);
    });

    it('U10: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.deleteUnidad(9999))
        .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
    });
  });

  // TEST - RESTAURACIÓN DE UNIDAD
  describe('restoreUnidad', () => {
    it('U11: Restauración exitosa', async () => {
      const mockUnidad = { id: 1, activo: false };
      const restored = { ...mockUnidad, activo: true };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadRepo.restoreUnidad as jest.Mock).mockResolvedValue(restored);

      const result = await unidadService.restoreUnidad(1);

      expect(result).toEqual(restored);
      expect(unidadRepo.restoreUnidad).toHaveBeenCalledWith(1);
    });

    it('U12: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.restoreUnidad(9999))
        .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
    });
  });

  // TEST - PUBLICACIÓN DE UNIDAD
  describe('publicateUnidad', () => {
    it('U13: Publicación exitosa', async () => {
      const mockUnidad = { id: 1 };
      const published = { ...mockUnidad, estado_publicado: true };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadRepo.publicateUnidad as jest.Mock).mockResolvedValue(published);

      const result = await unidadService.publicateUnidad(1);

      expect(result).toEqual(published);
      expect(unidadRepo.publicateUnidad).toHaveBeenCalledWith(1);
    });

    it('U14: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.publicateUnidad(9999))
        .rejects.toMatchObject({ status: 404 });
    });
  });

  // TEST - DESACTIVACIÓN DE UNIDAD
  describe('deactivateUnidad', () => {
    it('U15: Desactivación exitosa', async () => {
      const mockUnidad = { id: 1 };
      const deactivated = { ...mockUnidad, estado_publicado: false };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadRepo.deactivateUnidad as jest.Mock).mockResolvedValue(deactivated);

      const result = await unidadService.deactivateUnidad(1);

      expect(result).toEqual(deactivated);
      expect(unidadRepo.deactivateUnidad).toHaveBeenCalledWith(1);
    });

    it('U16: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.deactivateUnidad(9999))
        .rejects.toMatchObject({ status: 404 });
    });
  });

  // TEST - OBTENER UNIDADES POR EDICIÓN
  describe('getUnidadesByEdicion', () => {
    it('U17: Listar unidades de una edición existente', async () => {
      const mockUnidades = [{ id: 1, id_edicion: 1, titulo: 'Intro' }];
      (unidadRepo.getUnidadesByEdicion as jest.Mock).mockResolvedValue(mockUnidades);

      const result = await unidadService.getUnidadesByEdicion(1);

      expect(result).toEqual(mockUnidades);
      expect(unidadRepo.getUnidadesByEdicion).toHaveBeenCalledWith(1);
    });

    it('U18: Edición sin unidades registradas', async () => {
      (unidadRepo.getUnidadesByEdicion as jest.Mock).mockResolvedValue([]);
      const result = await unidadService.getUnidadesByEdicion(2);

      expect(result).toEqual([]);
    });

    it('U19: Edición inexistente', async () => {
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.getUnidadesByEdicion(9999))
        .rejects.toMatchObject({ status: 404, message: 'Edición no encontrada' });
    });
  });

  // TEST - OBTENER UNIDAD POR ID
  describe('getUnidad', () => {
    it('U20: Consulta exitosa', async () => {
      const mockUnidad = { id: 1, id_edicion: 1, titulo: 'Intro' };
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(mockUnidad);

      const result = await unidadService.getUnidad(1);

      expect(result).toEqual(mockUnidad);
      expect(unidadRepo.getUnidadById).toHaveBeenCalledWith(1);
    });

    it('U21: Unidad inexistente', async () => {
      (unidadRepo.getUnidadById as jest.Mock).mockResolvedValue(null);
      await expect(unidadService.getUnidad(9999))
        .rejects.toMatchObject({ status: 404, message: 'Unidad no encontrada' });
    });
  });
});
