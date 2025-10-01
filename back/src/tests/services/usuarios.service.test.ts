import * as userService from '../../services/usuarios.service';
import * as userRepo from '../../repositories/usuarios.repository';
import { UsuarioCreate } from '../../types/usuarios.types';

// Mock del repositorio
jest.mock('../../repositories/usuarios.repository');

describe('Usuarios Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsuarios', () => {
    it('debe retornar todos los usuarios', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'Juan', email: 'juan@test.com' },
        { id: 2, nombre: 'María', email: 'maria@test.com' }
      ];

      (userRepo.getAllUsuarios as jest.Mock).mockResolvedValue(mockUsuarios);

      const result = await userService.getUsuarios();

      expect(result).toEqual(mockUsuarios);
      expect(userRepo.getAllUsuarios).toHaveBeenCalledTimes(1);
    });

    it('debe manejar errores del repositorio', async () => {
      (userRepo.getAllUsuarios as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(userService.getUsuarios()).rejects.toThrow('Database error');
    });
  });

  describe('createUsuario', () => {
    it('debe crear un usuario exitosamente', async () => {
      const newUser: UsuarioCreate = {
        nombre: 'Pedro',
        apellido:'Test',
        email: 'pedro@test.com',
        password_hash: 'password123'
      };

      const createdUser = { id: 1, ...newUser };
      (userRepo.createUsuario as jest.Mock).mockResolvedValue(createdUser);

      const result = await userService.createUsuario(newUser);

      expect(result).toEqual(createdUser);
      expect(userRepo.createUsuario).toHaveBeenCalledWith(newUser);
    });
  });

  describe('updateUsuario', () => {
    it('debe actualizar un usuario existente', async () => {
      const updateData = { nombre: 'Juan Actualizado' };
      const updatedUser = { id: 1, nombre: 'Juan Actualizado', email: 'juan@test.com' };

      (userRepo.updateUsuario as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUsuario(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(userRepo.updateUsuario).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('deleteUsuario', () => {
    it('debe eliminar un usuario', async () => {
      (userRepo.deleteUsuario as jest.Mock).mockResolvedValue({ id: 1 });

      await userService.deleteUsuario(1);

      expect(userRepo.deleteUsuario).toHaveBeenCalledWith(1);
    });
  });
});
