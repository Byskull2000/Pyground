import { stringToRolEnum } from '../utils/RolEnum';
import * as userRepo from '../repositories/usuarios.repository';
import { UsuarioCreate, UsuarioUpdate } from '../types/usuarios.types';
import bcrypt from 'bcrypt';
import { RolesEnum } from '@prisma/client';

export const getUsuarios = () => {
  return userRepo.getAllUsuarios();
};

export const getUsuario = (id: number) => {
  return userRepo.getUsuarioById(id);
};

export const createUsuario = async (data: UsuarioCreate) => {
  const { email, password } = data;

  if (!email) throw { status: 400, message: 'El email es obligatorio' };
  if (!isValidEmail(email)) throw { status: 400, message: 'Email inválido' };
  if (!password) throw { status: 400, message: 'La contraseña es obligatoria' };
  if (password.length < 7) throw { status: 400, message: 'La contraseña es demasiado corta' };
  if (!isStrongPassword(password)) throw { status: 400, message: 'La contraseña no cumple requisitos de seguridad' };

  const existingUser = await userRepo.getUsuarioByEmail(email);
  if (existingUser) throw { status: 409, message: 'El email ya está registrado' };

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const newUserData = {
    ...data,
    password_hash,
  };
  delete (newUserData as any).password; 

  const newUser = await userRepo.createUsuario(newUserData);

  return newUser;
};

export const updateUsuario = (id: number, data: UsuarioUpdate) => {
  return userRepo.updateUsuario(id, data);
};

export const deleteUsuario = (id: number) => {
  return userRepo.deleteUsuario(id);
};

export const assignRol = async (id: number, rol: string) => {
  let rolEnum: RolesEnum;

  try {
    rolEnum = stringToRolEnum(rol);
  } catch (err) {
    throw { status: 400, message: 'Rol no válido' }; 
  }

  const user = await userRepo.getUsuarioById(id);
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }

  try {
    const updatedUser = await userRepo.updateRol(id, rolEnum);
    return { message: 'Rol asignado correctamente', user: updatedUser };
  } catch (err) {
    throw { status: 500, message: 'Error al asignar rol' };
  }
};

const isValidEmail = (email: string): boolean => {
  // Regex simple para validar email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isStrongPassword = (password: string): boolean => {
  // Al menos 7 caracteres, una mayúscula y un número
  return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password);
};