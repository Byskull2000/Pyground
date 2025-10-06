import { Request, Response } from 'express';
import * as userService from '../services/usuarios.service';
import { ApiResponse } from '../utils/apiResponse';

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await userService.getUsuarios();
    res.json(new ApiResponse(true, usuarios));
  } catch (err) {
    res.status(500).json(new ApiResponse(false, null, 'Error al obtener usuarios'));
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await userService.getUsuario(id);
    if (!usuario) 
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    res.json(new ApiResponse(true, usuario));
  } catch (err) {
    res.status(500).json(new ApiResponse(false, null, 'Error al obtener usuario'));
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await userService.createUsuario(req.body);
    res.status(201).json(new ApiResponse(true, usuario));
  } catch (err:any) {
    res
      .status(err.status || 500)
      .json(new ApiResponse(false, null, err.message || 'Error al crear usuario'));
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await userService.updateUsuario(id, req.body);
    res.json(new ApiResponse(true, usuario));
  } catch (err:any) {
    res
      .status(err.status || 500)
      .json(new ApiResponse(false, null, err.message || 'Error al actualizar usuario'));  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await userService.deleteUsuario(id);
    res.json(new ApiResponse(true, { message: 'Usuario eliminado correctamente' }));
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(new ApiResponse(false, null, err.message || 'Error al eliminar usuario'));
  }
};
