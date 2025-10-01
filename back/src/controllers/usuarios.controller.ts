import { Request, Response } from 'express';
import * as userService from '../services/usuarios.service';

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await userService.getUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await userService.getUsuario(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await userService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await userService.updateUsuario(id, req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await userService.deleteUsuario(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
