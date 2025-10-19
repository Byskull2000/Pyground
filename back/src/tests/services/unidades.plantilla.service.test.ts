import * as unidadPlantillaService from '../../services/unidades.plantilla.service';
import * as unidadPlantillaRepo from '../../repositories/unidades.plantilla.repository';
import { UnidadPlantillaCreate, UnidadPlantillaUpdate } from '../../types/unidades.plantilla.types';

jest.mock('../../repositories/unidades.plantilla.repository');

describe('UnidadPlantilla Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST - OBTENER UNIDADES
  describe('getUnidadesPlantilla', () => {
    it('UP11: Listar unidades de un curso existente', async () => {
      const mockUnidades = [
        { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true },
        { id: 2, id_curso: 1, titulo: 'Capítulo 2', orden: 2, version: 1, activo: true }
      ];
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue(mockUnidades);

      const result = await unidadPlantillaService.getUnidadesPlantilla(1);

      expect(result).toEqual(mockUnidades);
      expect(unidadPlantillaRepo.getUnidadesPlantillaByCurso).toHaveBeenCalledWith(1);
    });

    it('UP12: Curso sin unidades registradas', async () => {
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue([]);

      const result = await unidadPlantillaService.getUnidadesPlantilla(2);

      expect(result).toEqual([]);
    });
  });

  describe('getUnidadPlantilla', () => {
    it('UP1: Obtener unidad existente', async () => {
      const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(mockUnidad);

      const result = await unidadPlantillaService.getUnidadPlantilla(1);

      expect(result).toEqual(mockUnidad);
      expect(unidadPlantillaRepo.getUnidadPlantillaById).toHaveBeenCalledWith(1);
    });

    it('UP8/UP10: Unidad inexistente', async () => {
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(null);

      await expect(unidadPlantillaService.getUnidadPlantilla(999))
        .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
    });
  });

  // TEST - CREAR UNIDAD
  describe('createUnidadPlantilla', () => {
    const baseData: UnidadPlantillaCreate = { id_curso: 1, titulo: 'Introducción', orden: 1 };

    it('UP1: Creación exitosa', async () => {
      const mockNueva = { id: 10, ...baseData, version: 1, activo: true };
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue([]);
      (unidadPlantillaRepo.createUnidadPlantilla as jest.Mock).mockResolvedValue(mockNueva);

      const result = await unidadPlantillaService.createUnidadPlantilla(baseData);

      expect(result).toEqual(mockNueva);
      expect(unidadPlantillaRepo.createUnidadPlantilla).toHaveBeenCalledWith({
            ...baseData,
            version: 1,
            activo: true
        });

    });

    it('UP2: Faltan título', async () => {
      const invalidData = { ...baseData, titulo: '' } as UnidadPlantillaCreate;
      await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
        .rejects.toMatchObject({ status: 400, message: 'El título es obligatorio' });
    });

    it('UP3: Faltan id_curso', async () => {
      const invalidData = { ...baseData, id_curso: null } as unknown as UnidadPlantillaCreate;
      await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
        .rejects.toMatchObject({ status: 400, message: 'El curso es obligatorio' });
    });

    it('UP4: Faltan orden', async () => {
      const invalidData = { ...baseData, orden: null } as unknown as UnidadPlantillaCreate;
      await expect(unidadPlantillaService.createUnidadPlantilla(invalidData))
        .rejects.toMatchObject({ status: 400, message: 'El orden es obligatorio' });
    });

    it('UP5: Unidad duplicada en el mismo curso', async () => {
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue([{ id: 1, titulo: 'Introducción' }]);
      await expect(unidadPlantillaService.createUnidadPlantilla(baseData))
        .rejects.toMatchObject({ status: 409, message: 'Ya existe una unidad con ese nombre para este curso' });
    });

    it('UP6: Error interno del repositorio', async () => {
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue([]);
      (unidadPlantillaRepo.createUnidadPlantilla as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(unidadPlantillaService.createUnidadPlantilla(baseData))
        .rejects.toThrow('DB error');
    });
  });

  // TEST - ACTUALIZAR UNIDAD
  describe('updateUnidadPlantilla', () => {
    const updateData: UnidadPlantillaUpdate = { titulo: 'Nuevo Título' };

    it('UP7: Actualización exitosa', async () => {
      const mockUnidad = { id: 1, id_curso: 1, titulo: 'Intro', orden: 1, version: 1, activo: true };
      const updatedUnidad = { ...mockUnidad, ...updateData };
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadPlantillaRepo.updateUnidadPlantilla as jest.Mock).mockResolvedValue(updatedUnidad);

      const result = await unidadPlantillaService.updateUnidadPlantilla(1, updateData);

      expect(result).toEqual(updatedUnidad);
      expect(unidadPlantillaRepo.updateUnidadPlantilla).toHaveBeenCalledWith(1, updateData);
    });

    it('UP8: Unidad inexistente', async () => {
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(null);
      await expect(unidadPlantillaService.updateUnidadPlantilla(999, updateData))
        .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
    });
  });

  // TEST - ELIMINACIÓN LÓGICA
  describe('deleteUnidadPlantilla', () => {
    it('UP9: Eliminación exitosa', async () => {
      const mockUnidad = { id: 1, activo: true };
      const updatedUnidad = { ...mockUnidad, activo: false };
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(mockUnidad);
      (unidadPlantillaRepo.updateUnidadPlantilla as jest.Mock).mockResolvedValue(updatedUnidad);

      const result = await unidadPlantillaService.deleteUnidadPlantilla(1);

      expect(result).toEqual(updatedUnidad);
      expect(unidadPlantillaRepo.updateUnidadPlantilla).toHaveBeenCalledWith(1, { activo: false });
    });

    it('UP10: Unidad inexistente', async () => {
      (unidadPlantillaRepo.getUnidadPlantillaById as jest.Mock).mockResolvedValue(null);
      await expect(unidadPlantillaService.deleteUnidadPlantilla(999))
        .rejects.toMatchObject({ status: 404, message: 'Unidad plantilla no encontrada' });
    });
  });
});
