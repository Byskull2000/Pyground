import * as cursoService from '../../services/cursos.service';
import * as cursoRepo from '../../repositories/cursos.repository';

// Mock del repositorio
jest.mock('../../repositories/cursos.repository');

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
    it('debe retornar un curso por id', async () => {
      const mockCurso = {
        id: 1,
        nombre: 'Matemáticas',
        codigo_curso: 'MAT101',
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

    it('debe retornar null si el curso no existe', async () => {
      (cursoRepo.getCursoById as jest.Mock).mockResolvedValue(null);

      const result = await cursoService.getCursoById(999);

      expect(result).toBeNull();
    });
  });
});
