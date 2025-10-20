// back/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as emailService from '../services/email.service';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../config/prisma';

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

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === 'Invalid credentials') {
      return res.status(401).json(new ApiResponse(false, null, 'Credenciales inválidas'));
    }

    if (message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (message === 'Email not verified') {
      return res
        .status(403)
        .json(new ApiResponse(false, null, 'Por favor verifica tu email antes de iniciar sesión'));
    }

    if (message === 'Account inactive') {
      return res
        .status(403)
        .json(new ApiResponse(false, null, 'Cuenta inactiva. Contacte al administrador'));
    }

    res.status(500).json(new ApiResponse(false, null, 'Error al iniciar sesión'));
  }
};

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

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (message === 'Email already verified') {
      return res.status(400).json(new ApiResponse(false, null, 'El email ya está verificado'));
    }

    if (message === 'No verification code found') {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'No se encontró código de verificación'));
    }

    if (message === 'Verification code expired') {
      return res
        .status(400)
        .json(new ApiResponse(false, null, 'El código de verificación ha expirado'));
    }

    if (message === 'Invalid verification code') {
      return res.status(400).json(new ApiResponse(false, null, 'Código de verificación inválido'));
    }

    //console.error('Error al verificar email:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al verificar email'));
  }
};

export const reenviarCodigo = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(false, null, 'Email es requerido'));
    }

    const result = await authService.reenviarCodigoVerificacion(email);
    res.json(new ApiResponse(true, result, 'Código reenviado exitosamente'));

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === 'User not found') {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (message === 'Email already verified') {
      return res.status(400).json(new ApiResponse(false, null, 'Email ya verificado'));
    }

    if (message === 'Error al enviar email de verificación') {
      return res
        .status(500)
        .json(new ApiResponse(false, null, 'Error al enviar el código'));
    }

    //console.error('Error al reenviar código:', err);
    res.status(500).json(new ApiResponse(false, null, 'Error al reenviar código'));
  }
};

//Enviar email de verificación directamente
export const enviarEmailVerificacion = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(false, null, 'Email es requerido'));
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json(new ApiResponse(false, null, 'Usuario no encontrado'));
    }

    if (usuario.email_verificado) {
      return res.status(400).json(new ApiResponse(false, null, 'El email ya está verificado'));
    }

    // Generar nuevo código si no existe o está expirado
    let codigoActual = usuario.codigo_verificacion;
    let expiracionActual = usuario.codigo_expiracion;

    if (!codigoActual || !expiracionActual || new Date() > expiracionActual) {
      codigoActual = emailService.generarCodigoVerificacion();
      expiracionActual = emailService.calcularExpiracion();

      // Actualizar código en BD
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          codigo_verificacion: codigoActual,
          codigo_expiracion: expiracionActual
        }
      });
    }

    // Enviar email
    await emailService.enviarEmailVerificacion(
      usuario.email,
      usuario.nombre,
      codigoActual
    );

    res.json(new ApiResponse(true, 
      { message: 'Email de verificación enviado' }, 
      'Email enviado exitosamente'
    ));

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    //console.error('Error al enviar email de verificación:', err);
    
    if (message === 'Error al enviar email de verificación') {
      return res
        .status(500)
        .json(new ApiResponse(false, null, 'Error al enviar el email. Intenta nuevamente.'));
    }

    res.status(500).json(new ApiResponse(false, null, 'Error al enviar email de verificación'));
  }
};