import * as userRepo from '../repositories/usuarios.repository';
import { UsuarioCreate, UsuarioUpdate } from '../types/usuarios.types';

export const getUsuarios = () => {
  return userRepo.getAllUsuarios();
};

export const getUsuario = (id: number) => {
  return userRepo.getUsuarioById(id);
};

export const createUsuario = (data: UsuarioCreate) => {
  return userRepo.createUsuario(data);
};

export const updateUsuario = (id: number, data: UsuarioUpdate) => {
  return userRepo.updateUsuario(id, data);
};

export const deleteUsuario = (id: number) => {
  return userRepo.deleteUsuario(id);
};
