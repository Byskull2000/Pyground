import * as edicionService from '../../services/ediciones.service';
import * as edicionRepo from '../../repositories/ediciones.repository';
import * as cursoRepo from '../../repositories/cursos.repository';
import { EdicionCreate } from '../../types/ediciones.types';

jest.mock('../../repositories/ediciones.repository');
jest.mock('../../repositories/cursos.repository');

describe('Ediciones Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEdicion', () => {
    it('ED1: Creación exitosa de una edición', async () => {
      const newEdicion: EdicionCreate = {
        id_curso: 1,
        nombre_edicion: 'Edición 2025',
        descripcion: 'Descripción opcional',
        fecha_apertura: new Date('2025-01-01'),
        fecha_cierre: new Date('2025-12-31'),
        creado_por: 'admin@correo.com'
      };

      const createdEdicion = { id: 1, ...newEdicion, activo: true, fecha_creacion: new Date() };

      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue({ id: 1, nombre: 'Curso 1' });

      (edicionRepo.getEdicionesByCursoAndNombre as jest.Mock).mockResolvedValue([]);
      (edicionRepo.createEdicion as jest.Mock).mockResolvedValue(createdEdicion);

      const result = await edicionService.createEdicion(newEdicion);

      expect(result).toEqual(createdEdicion);
      expect(edicionRepo.createEdicion).toHaveBeenCalledWith(newEdicion);
    });

    it('ED2: Faltan campos obligatorios', async () => {
      const newEdicion = { fecha_apertura: new Date(), fecha_cierre: new Date() } as any;

      await expect(edicionService.createEdicion(newEdicion))
        .rejects.toMatchObject({ status: 400, message: 'El nombre de la edición es obligatorio' });
    });

    it('ED3: Curso inexistente', async () => {
      const newEdicion: EdicionCreate = {
        id_curso: 9999,
        nombre_edicion: 'Edición Fantasma',
        fecha_apertura: new Date('2025-01-01'),
        fecha_cierre: new Date('2025-12-31'),
        creado_por: 'admin@correo.com'
      };

      (edicionRepo.createEdicion as jest.Mock).mockRejectedValue({ status: 404, message: 'Curso no encontrado' });

      await expect(edicionService.createEdicion(newEdicion))
        .rejects.toMatchObject({ status: 404, message: 'Curso no encontrado' });
    });

    it('ED4: Fecha de apertura inválida', async () => {
      const newEdicion: EdicionCreate = {
        id_curso: 1,
        nombre_edicion: 'Edición Inválida',
        fecha_apertura: 'texto inválido' as any,
        fecha_cierre: new Date('2025-12-31'),
        creado_por: 'admin@correo.com'
      };

      await expect(edicionService.createEdicion(newEdicion))
        .rejects.toMatchObject({ status: 400, message: 'La fecha de apertura es inválida' });
    });

    it('ED5: Duplicado de edición dentro del mismo curso', async () => {
      const newEdicion: EdicionCreate = {
        id_curso: 1,
        nombre_edicion: 'Edición Duplicada',
        fecha_apertura: new Date('2025-01-01'),
        fecha_cierre: new Date('2025-12-31'),
        creado_por: 'admin@correo.com'
      };

      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue({ id: 1, nombre: 'Curso 1' });

      (edicionRepo.getEdicionesByCursoAndNombre as jest.Mock).mockResolvedValue([{ id: 99, ...newEdicion }]);

      await expect(edicionService.createEdicion(newEdicion))
        .rejects.toMatchObject({ status: 409, message: 'Ya existe una edición con ese nombre para este curso' });
    });

    it('ED6: Fecha de cierre antes de la apertura', async () => {
      const newEdicion: EdicionCreate = {
        id_curso: 1,
        nombre_edicion: 'Edición Mal Fechada',
        fecha_apertura: new Date('2025-12-31'),
        fecha_cierre: new Date('2025-01-01'),
        creado_por: 'admin@correo.com'
      };

      await expect(edicionService.createEdicion(newEdicion))
        .rejects.toMatchObject({ status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' });
    });
  });

  describe('getEdicionesByCurso', () => {
    it('Debe retornar lista de ediciones para un curso existente', async () => {
      const mockEdiciones = [
        { id: 1, nombre_edicion: 'Edición 1', id_curso: 1, fecha_apertura: new Date(), fecha_cierre: new Date(), creado_por: 'admin@correo.com' },
        { id: 2, nombre_edicion: 'Edición 2', id_curso: 1, fecha_apertura: new Date(), fecha_cierre: new Date(), creado_por: 'admin@correo.com' }
      ];

      (edicionRepo.getEdicionesByCurso as jest.Mock).mockResolvedValue(mockEdiciones);

      const result = await edicionService.getEdicionesByCurso(1);

      expect(result).toEqual(mockEdiciones);
      expect(edicionRepo.getEdicionesByCurso).toHaveBeenCalledWith(1);
    });

    it('Debe retornar lista vacía si no hay ediciones', async () => {
      (edicionRepo.getEdicionesByCurso as jest.Mock).mockResolvedValue([]);

      const result = await edicionService.getEdicionesByCurso(2);

      expect(result).toEqual([]);
      expect(edicionRepo.getEdicionesByCurso).toHaveBeenCalledWith(2);
    });

    it('Debe manejar error del repositorio', async () => {
      (edicionRepo.getEdicionesByCurso as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(edicionService.getEdicionesByCurso(1)).rejects.toThrow('DB error');
    });
  });
});
