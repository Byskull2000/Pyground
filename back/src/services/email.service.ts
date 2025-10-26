//back/src/services/email.service.ts
import nodemailer from 'nodemailer';

// Validar variables de entorno
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
 // console.warn(' EMAIL_USER o EMAIL_PASSWORD no están configurados. Los emails no se enviarán.');
}

// Configurar transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generar código de 6 dígitos
export const generarCodigoVerificacion = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calcular fecha de expiración (15 minutos desde ahora)
export const calcularExpiracion = (): Date => {
  const expiracion = new Date();
  expiracion.setMinutes(expiracion.getMinutes() + 15);
  return expiracion;
};

// Enviar email de verificación
export const enviarEmailVerificacion = async (
  email: string,
  nombre: string,
  codigo: string
): Promise<void> => {
  try {
    const enlaceVerificacion = `http://localhost:3000/verificacion?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"Pyground" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta',
      text: `Hola ${nombre},

Gracias por registrarte en nuestra plataforma.

Tu código de verificación es: ${codigo}

Este código expirará en 15 minutos.
También puedes verificar tu cuenta haciendo clic en el siguiente enlace:
${enlaceVerificacion}

Si no solicitaste este registro, puedes ignorar este mensaje.

---
Este es un correo automático, por favor no responder.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hola ${nombre},</h2>
          <p>Gracias por registrarte en nuestra plataforma.</p>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f0f0f0; border: 2px solid #ccc; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; color: #333;">${codigo}</span>
          </div>
          <p>Este código expirará en 15 minutos.</p>
          <p>También puedes verificar tu cuenta haciendo clic en el siguiente enlace:</p>
          <p><a href="${enlaceVerificacion}" style="color: #007bff;">Verificar cuenta</a></p>
          <p>Si no solicitaste este registro, puedes ignorar este mensaje.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Este es un correo automático, por favor no responder.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Email enviado:', info.messageId);
  } catch (error) {
    console.error(' Error al enviar email:', error);
    throw new Error('Error al enviar email de verificación');
  }
};

// Enviar email de bienvenida (después de verificar)
export const enviarEmailBienvenida = async (
  email: string,
  nombre: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: `"Pyground" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Cuenta verificada!',
      text: `¡Hola ${nombre}!

Tu cuenta ha sido verificada exitosamente.

Ya puedes iniciar sesión y disfrutar de todas las funcionalidades de nuestra plataforma.

¡Bienvenido/a a bordo!`
    };

    await transporter.sendMail(mailOptions);
    console.log(' Email de bienvenida enviado');
  } catch (error) {
    console.error(' Error al enviar email de bienvenida:', error);
    // No lanzamos error aquí porque la cuenta ya está verificada
  }
};