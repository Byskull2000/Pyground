import * as cursoService from '../../services/cursos.service';
import * as cursoRepo from '../../repositories/cursos.repository';
import * as unidadPlantillaRepo from '../../repositories/unidades.plantilla.repository';
import * as topicoPlantillaRepo from '../../repositories/topicos.plantilla.repository';

// Mock del repositorio
jest.mock('../../repositories/cursos.repository');
jest.mock('../../repositories/unidades.plantilla.repository');
jest.mock('../../repositories/topicos.plantilla.repository');

describe('Cursos Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCursos', () => {
    it('debe retornar todos los cursos', async () => {
      const mockCursos = [
        {
          id: 1,
          nombre: 'Python',
          codigo_curso: 'PYT001',
          descripcion: null,
          activo: true,
          fecha_creacion: new Date(),
          creado_por: null
        },
        {
          id: 2,
          nombre: 'Java',
          codigo_curso: 'JAV002',
          descripcion: null,
          activo: true,
          fecha_creacion: new Date(),
          creado_por: null
        }
      ];

      (cursoRepo.getAllCursos as jest.Mock).mockResolvedValue(mockCursos);

      const result = await cursoService.getCursos();

      expect(result).toEqual(mockCursos);
      expect(cursoRepo.getAllCursos).toHaveBeenCalledTimes(1);
    });

    it('debe manejar errores del repositorio', async () => {
      (cursoRepo.getAllCursos as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(cursoService.getCursos()).rejects.toThrow('Database error');
    });
  });

  describe('getCursoById', () => {
    it('VC1 - debe retornar un curso existente por id', async () => {
      const mockCurso = {
        id: 1,
        nombre: 'Python',
        codigo_curso: 'PYT001',
        descripcion: null,
        activo: true,
        fecha_creacion: new Date(),
        creado_por: null
      };

      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(mockCurso);

      const result = await cursoService.getCursoById(1);

      expect(result).toEqual(mockCurso);
      expect(cursoRepo.getCursoById).toHaveBeenCalledWith(1);
    });

    it('VC2 - debe retornar null si el curso no existe', async () => {
      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(null);

      const result = await cursoService.getCursoById(999);

      expect(result).toBeNull();
    });

    it('VC5 - debe propagar error si falla el repositorio', async () => {
      (cursoRepo.getCursoById as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(cursoService.getCursoById(123)).rejects.toThrow('Database connection failed');
    });
  });

  describe('publicateCurso', () => {
    it('PC1 - debe publicar un curso existente con unidades listas', async () => {
      const mockCurso = { id: 1, nombre: 'Python' };
      const mockUnidades = [{ id: 10, nombre: 'Unidad 1' }];
      const mockTopicos = [{ id: 10, nombre: 'Topico 1' }];
      const mockPublicado = { id: 1, nombre: 'Python', publicado: true };

      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(mockCurso);
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue(mockUnidades);
      (topicoPlantillaRepo.getTopicosPlantillaByCurso as jest.Mock).mockResolvedValue(mockTopicos);
      (cursoRepo.publicateCurso as jest.Mock).mockResolvedValue(mockPublicado);

      const result = await cursoService.publicateCurso(1);

      expect(result).toEqual(mockPublicado);
      expect(cursoRepo.getCursoById).toHaveBeenCalledWith(1);
      expect(unidadPlantillaRepo.getUnidadesPlantillaByCurso).toHaveBeenCalledWith(1);
      expect(topicoPlantillaRepo.getTopicosPlantillaByCurso).toHaveBeenCalledWith(1);
      expect(cursoRepo.publicateCurso).toHaveBeenCalledWith(1);
    });

    it('PC2 - debe lanzar error si el curso no existe', async () => {
      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(null);

      await expect(cursoService.publicateCurso(999))
        .rejects.toThrow('Curso no encontrado');
    });

    it('PC3 - debe lanzar error si no hay unidades listas', async () => {
      const mockCurso = { id: 1, nombre: 'Python' };
      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(mockCurso);
      (unidadPlantillaRepo.getUnidadesPlantillaByCurso as jest.Mock).mockResolvedValue([]);

      await expect(cursoService.publicateCurso(1))
        .rejects.toMatchObject({ status: 404, message: 'Este curso no tiene unidades listas' });
    });

  });

  describe('deactivateCurso', () => {
    it('DC1 - debe desactivar un curso existente', async () => {
      const mockCurso = { id: 2, nombre: 'Java' };
      const mockArchivado = { id: 2, nombre: 'Java', activo: false };

      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(mockCurso);
      (cursoRepo.deactivateCurso as jest.Mock).mockResolvedValue(mockArchivado);

      const result = await cursoService.deactivateCurso(2);

      expect(result).toEqual(mockArchivado);
      expect(cursoRepo.getCursoById).toHaveBeenCalledWith(2);
      expect(cursoRepo.deactivateCurso).toHaveBeenCalledWith(2);
    });

    it('DC2 - debe lanzar error si el curso no existe', async () => {
      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(null);

      await expect(cursoService.deactivateCurso(999))
        .rejects.toThrow('Curso no encontrado');
    });

  });
});
