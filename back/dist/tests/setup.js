"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = exports.createMockRequest = exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../../generated/prisma");
const auth_helper_1 = require("./helpers/auth.helper");
// Configurar variables de entorno para tests
process.env.JWT_SECRET = auth_helper_1.JWT_SECRET;
dotenv_1.default.config({ path: '.env.test' });
exports.prisma = new prisma_1.PrismaClient();
beforeAll(async () => {
    // Conectar a la base de datos de test
    await exports.prisma.$connect();
});
afterAll(async () => {
    // Limpiar y desconectar
    await exports.prisma.$disconnect();
});
afterEach(async () => {
    // Limpiar datos después de cada test en orden para evitar violaciones de FK
    await exports.prisma.inscripcion.deleteMany();
    await exports.prisma.topico.deleteMany();
    await exports.prisma.unidad.deleteMany();
    await exports.prisma.edicion.deleteMany();
    await exports.prisma.topicoPlantilla.deleteMany();
    await exports.prisma.unidadPlantilla.deleteMany();
    await exports.prisma.curso.deleteMany();
    await exports.prisma.usuario.deleteMany();
});
// Helpers para tests
const createMockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body,
        params,
        query,
        headers: {},
        user: null,
    };
};
exports.createMockRequest = createMockRequest;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
exports.createMockResponse = createMockResponse;
