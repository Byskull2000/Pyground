"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarEmailBienvenida = exports.enviarEmailVerificacion = exports.calcularExpiracion = exports.generarCodigoVerificacion = void 0;
//back/src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
// Validar variables de entorno
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    // console.warn(' EMAIL_USER o EMAIL_PASSWORD no están configurados. Los emails no se enviarán.');
}
// Configurar transportador de email
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Generar código de 6 dígitos
const generarCodigoVerificacion = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generarCodigoVerificacion = generarCodigoVerificacion;
// Calcular fecha de expiración (15 minutos desde ahora)
const calcularExpiracion = () => {
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);
    return expiracion;
};
exports.calcularExpiracion = calcularExpiracion;
// Enviar email de verificación
const enviarEmailVerificacion = async (email, nombre, codigo) => {
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
Este es un correo automático, por favor no responder.`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(' Email enviado:', info.messageId);
    }
    catch (error) {
        console.error(' Error al enviar email:', error);
        throw new Error('Error al enviar email de verificación');
    }
};
exports.enviarEmailVerificacion = enviarEmailVerificacion;
// Enviar email de bienvenida (después de verificar)
const enviarEmailBienvenida = async (email, nombre) => {
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
    }
    catch (error) {
        console.error(' Error al enviar email de bienvenida:', error);
        // No lanzamos error aquí porque la cuenta ya está verificada
    }
};
exports.enviarEmailBienvenida = enviarEmailBienvenida;
