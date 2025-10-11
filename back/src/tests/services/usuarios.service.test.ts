import * as userService from '../../services/usuarios.service';
import * as userRepo from '../../repositories/usuarios.repository';
import { UsuarioCreate } from '../../types/usuarios.types';
import bcrypt from 'bcrypt';

// Mock del repositorio
jest.mock('../../repositories/usuarios.repository');
jest.mock('bcrypt');

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
    it('debe crear un usuario exitosamente (RE1)', async () => {
      const newUser: UsuarioCreate = {
        nombre: 'Pedro',
        apellido:'Test',
        email: 'pedro@test.com',
        password: 'Password123'
      };

      const hashedPassword = 'hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = { 
        id: 1, 
        ...newUser, 
        password_hash: hashedPassword,
        mensaje: "Usuario registrado. Por favor verifica tu email con el código enviado."
      };
      (userRepo.createUsuario as jest.Mock).mockResolvedValue(createdUser);

      const result = await userService.createUsuario(newUser);

      expect(result).toEqual(createdUser);
      expect(userRepo.createUsuario).toHaveBeenCalledWith(expect.objectContaining({
        email: 'pedro@test.com',
        password_hash: hashedPassword
      }));
    });

    it('debe fallar si el email ya existe (RE2)', async () => {
      const newUser: UsuarioCreate = {
        email: 'exist@test.com',
        password: 'Password123',
        nombre: 'Juan',
        apellido: 'Ricaldez'
      };
      (userRepo.getUsuarioByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'exist@test.com' });

      await expect(userService.createUsuario(newUser))
        .rejects.toMatchObject({ status: 409, message: 'El email ya está registrado' });
    });

    it('debe fallar si falta email (RE7)', async () => {
      const newUser: UsuarioCreate = { password: 'Password123' } as any;

      await expect(userService.createUsuario(newUser))
        .rejects.toMatchObject({ status: 400, message: 'El email es obligatorio' });
    });

    it('debe fallar si el email es inválido (RE4)', async () => {
      const newUser: UsuarioCreate = {
        email: 'usuario', 
        password: 'Password123',
        nombre: 'Nombre',
        apellido: 'Apellido'
      };
      (userRepo.getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.createUsuario(newUser))
        .rejects.toMatchObject({ status: 400, message: 'Email inválido' });
    });

    it('debe fallar si la contraseña es demasiado corta (RE3/RE5)', async () => {
      const newUser: UsuarioCreate = {
        email: 'user@test.com', 
        password: '12',
        nombre: 'Nombre',
        apellido: 'Apellido'
      };
      (userRepo.getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.createUsuario(newUser))
        .rejects.toMatchObject({ status: 400, message: 'La contraseña es demasiado corta' });
    });
    
    it('debe fallar si la contraseña es débil (sin mayúscula/número) (RE6)', async () => {
      const newUser: UsuarioCreate = {
        email: 'user@test.com', 
        password: 'abcdefg',
        nombre: 'Nombre',
        apellido: 'Apellido'
      };
      (userRepo.getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.createUsuario(newUser))
        .rejects.toMatchObject({ status: 400, message: 'La contraseña no cumple requisitos de seguridad' });
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
