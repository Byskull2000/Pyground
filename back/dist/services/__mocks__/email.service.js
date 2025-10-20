"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarEmailBienvenida = exports.enviarEmailVerificacion = exports.calcularExpiracion = exports.generarCodigoVerificacion = exports.MOCK_VERIFICATION_CODE = void 0;
// Mock del servicio de email para pruebas
exports.MOCK_VERIFICATION_CODE = '123456';
exports.generarCodigoVerificacion = jest.fn().mockReturnValue(exports.MOCK_VERIFICATION_CODE);
exports.calcularExpiracion = jest.fn().mockReturnValue(new Date(Date.now() + 900000)); // 15 minutos
exports.enviarEmailVerificacion = jest.fn().mockResolvedValue(undefined);
exports.enviarEmailBienvenida = jest.fn().mockResolvedValue(undefined);
