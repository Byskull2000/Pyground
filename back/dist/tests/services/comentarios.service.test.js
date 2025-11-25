"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const comentarioService = __importStar(require("../../services/comentarios.service"));
const comentarioRepo = __importStar(require("../../repositories/comentarios.repository"));
const usuarioRepo = __importStar(require("../../repositories/usuarios.repository"));
const topicoRepo = __importStar(require("../../repositories/topicos.repository"));
jest.mock('../../repositories/comentarios.repository');
jest.mock('../../repositories/usuarios.repository');
jest.mock('../../repositories/topicos.repository');
describe('Comentarios Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock por defecto: ambos existen
        topicoRepo.getTopicoById.mockResolvedValue({ id: 1, titulo: 'Topico 1' });
        usuarioRepo.getUsuarioById.mockResolvedValue({ id: 10, nombre: 'Hans' });
    });
    // TEST - CREACIÓN DE COMENTARIO
    describe('createComentario', () => {
        const baseData = {
            id_topico: 1,
            id_usuario: 5,
            texto: 'Buen aporte'
        };
        it('C1: Creación exitosa', async () => {
            const mockComentario = {
                ...baseData,
                visto: false,
                fecha_publicacion: new Date().toISOString()
            };
            comentarioRepo.createComentario.mockResolvedValue(mockComentario);
            const result = await comentarioService.createComentario(baseData);
            expect(result).toEqual(mockComentario);
            expect(comentarioRepo.createComentario).toHaveBeenCalledWith(baseData);
        });
        it('C2: No se puede publicar comentarios vacíos', async () => {
            await expect(comentarioService.createComentario({ ...baseData, texto: '' })).rejects.toMatchObject({ status: 400, message: 'No se puede publicar comentarios vacios' });
        });
        it('C3: Falta id_topico', async () => {
            await expect(comentarioService.createComentario({ ...baseData, id_topico: null })).rejects.toMatchObject({ status: 400, message: 'El topico es obligatorio' });
        });
        it('C4: Falta id_usuario', async () => {
            await expect(comentarioService.createComentario({ ...baseData, id_usuario: null })).rejects.toMatchObject({ status: 400, message: 'Usuario no reconocido' });
        });
        it('C5: Topico no encontrado', async () => {
            topicoRepo.getTopicoById.mockResolvedValue(null);
            await expect(comentarioService.createComentario(baseData))
                .rejects.toMatchObject({ status: 404, message: 'Topico no encontrado' });
        });
        it('C6: Usuario no encontrado', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue(null);
            await expect(comentarioService.createComentario(baseData))
                .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
        });
        it('C7: Error interno del repositorio', async () => {
            comentarioRepo.createComentario.mockRejectedValue(new Error('Error al crear comentario'));
            await expect(comentarioService.createComentario(baseData))
                .rejects.toThrow('Error al crear comentario');
        });
    });
    // TEST - OBTENER COMENTARIOS POR TÓPICO
    describe('getComentariosByTopico', () => {
        const baseRequest = {
            id_topico: 1,
            id_usuario: 10
        };
        it('C8: Listar comentarios de un tópico existente', async () => {
            const mockComentarios = [
                { id_topico: 1, id_usuario: 2, texto: 'Muy buen aporte', visto: false, fecha_publicacion: '2025-11-10T12:00:00Z' },
                { id_topico: 1, id_usuario: 3, texto: 'Estoy de acuerdo', visto: true, fecha_publicacion: '2025-11-11T09:00:00Z' }
            ];
            comentarioRepo.getComentariosByTopico.mockResolvedValue(mockComentarios);
            const result = await comentarioService.getComentariosByTopico(baseRequest);
            expect(result).toEqual(mockComentarios);
            expect(comentarioRepo.getComentariosByTopico).toHaveBeenCalledWith(baseRequest);
        });
        it('C9: Falta id_topico', async () => {
            await expect(comentarioService.getComentariosByTopico({ id_usuario: 10 })).rejects.toMatchObject({ status: 400, message: 'El topico es obligatorio' });
        });
        it('C10: Falta id_usuario', async () => {
            await expect(comentarioService.getComentariosByTopico({ id_topico: 1 })).rejects.toMatchObject({ status: 400, message: 'Usuario no reconocido' });
        });
        it('C11: Topico no encontrado', async () => {
            topicoRepo.getTopicoById.mockResolvedValue(null);
            await expect(comentarioService.getComentariosByTopico(baseRequest))
                .rejects.toMatchObject({ status: 404, message: 'Topico no encontrado' });
        });
        it('C12: Usuario no encontrado', async () => {
            usuarioRepo.getUsuarioById.mockResolvedValue(null);
            await expect(comentarioService.getComentariosByTopico(baseRequest))
                .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
        });
        it('C13: Tópico sin comentarios', async () => {
            comentarioRepo.getComentariosByTopico.mockResolvedValue([]);
            const result = await comentarioService.getComentariosByTopico(baseRequest);
            expect(result).toEqual([]);
            expect(comentarioRepo.getComentariosByTopico).toHaveBeenCalledWith(baseRequest);
        });
    });
});
