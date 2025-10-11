import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nombre: string;
      apellido: string;
    }
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validación de campos requeridos
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'Email y password son requeridos'));
    }

    const result = await authService.loginUser(email, password);
    res.json(new ApiResponse(true, result, 'Inicio de sesión exitoso'));

  } catch (err: any) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json(new ApiResponse(false, null, 'Credenciales inválidas'));
    }

    if (err.message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }
//cora
    if (err.message === 'Email not verified') {
      return res
        .status(403)
        .json(new ApiResponse(false, null, 'Por favor verifica tu email antes de iniciar sesión'));
    }

    if (err.message === 'Account inactive') {
      return res
        .status(403)
        .json(new ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador'));
    }

    //console.error('Error en login:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al iniciar sesión'));
  }
};
//cora
export const verificarEmail = async (req: Request, res: Response) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'Email y código son requeridos'));
    }

    const result = await authService.verificarEmail(email, codigo);
    res.json(new ApiResponse(true, result, 'Email verificado exitosamente'));

  } catch (err: any) {
    if (err.message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (err.message === 'Email already verified') {
      return res.status(400).json(new ApiResponse(false, null, 'El email ya está verificado'));
    }

    if (err.message === 'No verification code found') {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'No se encontró código de verificación'));
    }

    if (err.message === 'Verification code expired') {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'El código de verificación ha expirado'));
    }

    if (err.message === 'Invalid verification code') {
      return res.status(400).json(new ApiResponse(false, null, 'Código de verificación inválido'));
    }

    console.error('Error al verificar email:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al verificar email'));
  }
};

// cora
export const reenviarCodigo = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(false, null, 'Email es requerido'));
    }

    const result = await authService.reenviarCodigoVerificacion(email);
    res.json(new ApiResponse(true, result, 'Código reenviado exitosamente'));

  } catch (err: any) {
    if (err.message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (err.message === 'Email already verified') {
      return res.status(400).json(new ApiResponse(false, null, 'Email ya verificado'));
    }

    if (err.message === 'Error al enviar email de verificación') {
      return res
        .status(500)
        .json(new ApiResponse(false, null, 'Error al enviar el código'));
    }

    console.error('Error al reenviar código:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al reenviar código'));
  }
};

/*export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiResponse(false, null, 'No autorizado'));
    }

    const { currentPassword, newPassword } = req.body;

    // Validación de campos requeridos
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'Contraseña actual y nueva contraseña son requeridas'));
    }

    // Validación de longitud de contraseña
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'La nueva contraseña debe tener al menos 6 caracteres'));
    }

    await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(new ApiResponse(true, { message: 'Contraseña actualizada correctamente' }));

  } catch (err: any) {
    if (err.message === 'Invalid current password') {
      return res.status(401).json(new ApiResponse(false, null, 'Contraseña actual incorrecta'));
    }

    console.error('Error al cambiar contraseña:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al cambiar contraseña'));
  }
};*/