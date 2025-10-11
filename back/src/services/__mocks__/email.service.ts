// Mock del servicio de email para pruebas
export const MOCK_VERIFICATION_CODE = '123456';

export const generarCodigoVerificacion = jest.fn().mockReturnValue(MOCK_VERIFICATION_CODE);

export const calcularExpiracion = jest.fn().mockReturnValue(new Date(Date.now() + 900000)); // 15 minutos

export const enviarEmailVerificacion = jest.fn().mockResolvedValue(undefined);

export const enviarEmailBienvenida = jest.fn().mockResolvedValue(undefined);