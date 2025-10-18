import * as inscripcionService from '../../services/inscripciones.service';
import * as inscripcionRepo from '../../repositories/inscripciones.repository';
import * as usuarioRepo from '../../repositories/usuarios.repository';
import * as edicionRepo from '../../repositories/ediciones.repository';
import * as cargoRepo from '../../repositories/cargos.repository';
import { InscripcionCreate } from '../../types/inscripciones.types';

jest.mock('../../repositories/inscripciones.repository');
jest.mock('../../repositories/usuarios.repository');
jest.mock('../../repositories/ediciones.repository');
jest.mock('../../repositories/cargos.repository');

describe('Inscripciones Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  // TEST - GET INSCRIPCIONES POR EDICIÓN

  describe('getInscripcionesByEdicion', () => {
    it('IS1: Debe retornar lista de inscripciones por edición', async () => {
      const mockInscripciones = [
        { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 },
        { id: 2, usuario_id: 2, edicion_id: 1, cargo_id: 2 }
      ];

      (inscripcionRepo.getInscripcionesByEdicion as jest.Mock).mockResolvedValue(mockInscripciones);

      const result = await inscripcionService.getInscripcionesByEdicion(1);

      expect(result).toEqual(mockInscripciones);
      expect(inscripcionRepo.getInscripcionesByEdicion).toHaveBeenCalledWith(1);
    });

    it('IS2: Debe retornar lista vacía si no hay inscripciones', async () => {
      (inscripcionRepo.getInscripcionesByEdicion as jest.Mock).mockResolvedValue([]);

      const result = await inscripcionService.getInscripcionesByEdicion(2);

      expect(result).toEqual([]);
      expect(inscripcionRepo.getInscripcionesByEdicion).toHaveBeenCalledWith(2);
    });
  });


  // TEST - GET INSCRIPCIÓN POR ID

  describe('getInscripcion', () => {
    it('IS3: Debe retornar una inscripción existente', async () => {
      const mockInscripcion = { id: 1, usuario_id: 1, edicion_id: 1, cargo_id: 1 };
      (inscripcionRepo.getInscripcionById as jest.Mock).mockResolvedValue(mockInscripcion);

      const result = await inscripcionService.getInscripcion(1);

      expect(result).toEqual(mockInscripcion);
      expect(inscripcionRepo.getInscripcionById).toHaveBeenCalledWith(1);
    });

    it('IS4: Debe lanzar error si la inscripción no existe', async () => {
      (inscripcionRepo.getInscripcionById as jest.Mock).mockResolvedValue(null);

      await expect(inscripcionService.getInscripcion(999))
        .rejects.toMatchObject({ status: 404, message: 'Inscripción no encontrada' });
    });
  });


  // TEST - CREAR INSCRIPCIÓN

  describe('createInscripcion', () => {
    const baseData: InscripcionCreate = {
      usuario_id: 1,
      edicion_id: 1,
      cargo_id: 1
    };

    it('IS5: Creación exitosa de una inscripción', async () => {
      const mockUsuario = { id: 1, nombre: 'Usuario Test' };
      const mockEdicion = { id: 1, activo: true, estado_publicado: true };
      const mockCargo = { id: 1, nombre: 'Participante' };
      const mockNueva = { id: 10, ...baseData };

      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue(mockUsuario);
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue(mockEdicion);
      (cargoRepo.getCargoById as jest.Mock).mockResolvedValue(mockCargo);
      (inscripcionRepo.getInscripcionesByEdicion as jest.Mock).mockResolvedValue([]);
      (inscripcionRepo.createInscripcion as jest.Mock).mockResolvedValue(mockNueva);
      (inscripcionRepo.getInscripcionById as jest.Mock).mockResolvedValue(mockNueva);

      const result = await inscripcionService.createInscripcion(baseData);

      expect(result).toEqual(mockNueva);
      expect(inscripcionRepo.createInscripcion).toHaveBeenCalledWith(baseData);
      expect(inscripcionRepo.getInscripcionById).toHaveBeenCalledWith(mockNueva.id);
    });

    it('IS6: Faltan campos obligatorios', async () => {
      const invalidData = { edicion_id: 1, cargo_id: 1 } as InscripcionCreate;
      await expect(inscripcionService.createInscripcion(invalidData))
        .rejects.toMatchObject({ status: 400, message: 'El usuario es obligatorio' });
    });

    it('IS7: Usuario no encontrado', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue(null);

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado o inactivo' });
    });

    it('IS8: Edición no encontrada o inactiva', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 1 });
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, activo: false });

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 404, message: 'Edición no encontrada o inactiva' });
    });

    it('IS9: Edición no publicada', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 1 });
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, activo: true, estado_publicado: false });

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 409, message: 'La edición no esta abierta a inscripciones' });
    });

    it('IS10: Cargo no encontrado', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 1 });
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
      (cargoRepo.getCargoById as jest.Mock).mockResolvedValue(null);

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 404, message: 'Cargo no encontrado' });
    });

    it('IS11: Usuario ya inscrito en la edición', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 1 });
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
      (cargoRepo.getCargoById as jest.Mock).mockResolvedValue({ id: 1 });
      (inscripcionRepo.getInscripcionesByEdicion as jest.Mock).mockResolvedValue([{ id: 5, usuario_id: 1 }]);

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 409, message: 'El usuario ya está inscrito en esta edición' });
    });

    it('IS12: Error al crear inscripción (error interno)', async () => {
      (usuarioRepo.getUsuarioById as jest.Mock).mockResolvedValue({ id: 1 });
      (edicionRepo.getEdicionById as jest.Mock).mockResolvedValue({ id: 1, activo: true, estado_publicado: true });
      (cargoRepo.getCargoById as jest.Mock).mockResolvedValue({ id: 1 });
      (inscripcionRepo.getInscripcionesByEdicion as jest.Mock).mockResolvedValue([]);
      (inscripcionRepo.createInscripcion as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(inscripcionService.createInscripcion(baseData))
        .rejects.toMatchObject({ status: 500, message: 'Error al registrar la inscripción' });
    });
  });
});
