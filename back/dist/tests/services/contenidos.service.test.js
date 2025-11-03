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
const contenidosService = __importStar(require("../../services/contenidos.service"));
const contenidosRepo = __importStar(require("../../repositories/contenidos.repository"));
const topicosRepo = __importStar(require("../../repositories/topicos.repository"));
jest.mock('../../repositories/contenidos.repository');
jest.mock('../../repositories/topicos.repository');
var TipoContenidoEnum;
(function (TipoContenidoEnum) {
    TipoContenidoEnum["TEXTO"] = "TEXTO";
    TipoContenidoEnum["IMAGEN"] = "IMAGEN";
    TipoContenidoEnum["VIDEO"] = "VIDEO";
    TipoContenidoEnum["AUDIO"] = "AUDIO";
    TipoContenidoEnum["ARCHIVO"] = "ARCHIVO";
})(TipoContenidoEnum || (TipoContenidoEnum = {}));
describe('Contenidos Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createContenidos', () => {
        const topicoMock = { id: 1, nombre: 'Tópico 1' };
        it('CT1: Creación exitosa', async () => {
            const data = [
                { tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'Contenido 1' },
                { tipo: TipoContenidoEnum.IMAGEN, orden: 2, enlace_archivo: 'imagen.jpg' }
            ];
            topicosRepo.getTopicoById.mockResolvedValue(topicoMock);
            contenidosRepo.createContenidos.mockResolvedValue([{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }]);
            const result = await contenidosService.createContenidos(1, data);
            expect(result).toEqual([{ id: 10, id_topico: 1, ...data[0] }, { id: 11, id_topico: 1, ...data[1] }]);
            expect(contenidosRepo.createContenidos).toHaveBeenCalledWith({ id_topico: 1, contenidos: data });
        });
        it('CT2: Falta id_topico', async () => {
            await expect(contenidosService.createContenidos(null, [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }]))
                .rejects.toMatchObject({ status: 400, message: 'El id_topico es obligatorio' });
        });
        it('CT3: No hay contenidos', async () => {
            topicosRepo.getTopicoById.mockResolvedValue(topicoMock);
            await expect(contenidosService.createContenidos(1, []))
                .rejects.toMatchObject({ status: 400, message: 'Debe incluir al menos un contenido' });
        });
        it('CT4: Tópico inexistente', async () => {
            topicosRepo.getTopicoById.mockResolvedValue(null);
            await expect(contenidosService.createContenidos(9999, [{ tipo: TipoContenidoEnum.TEXTO, orden: 1, texto: 'x' }]))
                .rejects.toMatchObject({ status: 404, message: 'Tópico no encontrado' });
        });
    });
    describe('updateContenido', () => {
        it('CT5: Actualización exitosa', async () => {
            const contenidoMock = { id: 1, activo: true };
            const data = { orden: 2 };
            contenidosRepo.getContenidoById.mockResolvedValue(contenidoMock);
            contenidosRepo.updateContenido.mockResolvedValue({ ...contenidoMock, ...data });
            const result = await contenidosService.updateContenido(1, data);
            expect(result).toEqual({ ...contenidoMock, ...data });
            expect(contenidosRepo.updateContenido).toHaveBeenCalledWith(1, data);
        });
        it('CT6: Contenido inexistente', async () => {
            contenidosRepo.getContenidoById.mockResolvedValue(null);
            await expect(contenidosService.updateContenido(9999, {}))
                .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
        });
    });
    describe('deleteContenido', () => {
        it('CT7: Eliminación exitosa', async () => {
            const contenidoMock = { id: 1, activo: true };
            contenidosRepo.getContenidoById.mockResolvedValue(contenidoMock);
            contenidosRepo.deleteContenido.mockResolvedValue({ ...contenidoMock, activo: false });
            const result = await contenidosService.deleteContenido(1);
            expect(result).toEqual({ ...contenidoMock, activo: false });
            expect(contenidosRepo.deleteContenido).toHaveBeenCalledWith(1);
        });
        it('CT8: Contenido inexistente', async () => {
            contenidosRepo.getContenidoById.mockResolvedValue(null);
            await expect(contenidosService.deleteContenido(9999))
                .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
        });
        it('CT9: Contenido ya inactivo', async () => {
            contenidosRepo.getContenidoById.mockResolvedValue({ id: 1, activo: false });
            await expect(contenidosService.deleteContenido(1))
                .rejects.toMatchObject({ status: 400, message: 'El contenido ya está inactivo' });
        });
    });
    describe('getContenidosByTopico', () => {
        it('CT10: Listar contenidos de un tópico existente', async () => {
            const contenidosMock = [{ id: 1 }, { id: 2 }];
            topicosRepo.getTopicoById.mockResolvedValue({ id: 1 });
            contenidosRepo.getContenidosByTopico.mockResolvedValue(contenidosMock);
            const result = await contenidosService.getContenidosByTopico(1);
            expect(result).toEqual(contenidosMock);
            expect(contenidosRepo.getContenidosByTopico).toHaveBeenCalledWith(1);
        });
        it('CT11: Tópico sin contenidos registrados', async () => {
            topicosRepo.getTopicoById.mockResolvedValue({ id: 1 });
            contenidosRepo.getContenidosByTopico.mockResolvedValue([]);
            const result = await contenidosService.getContenidosByTopico(1);
            expect(result).toEqual([]);
        });
        it('CT12: Tópico inexistente', async () => {
            topicosRepo.getTopicoById.mockResolvedValue(null);
            await expect(contenidosService.getContenidosByTopico(9999))
                .rejects.toMatchObject({ status: 404, message: 'Tópico no encontrado' });
        });
    });
    describe('getContenidoById', () => {
        it('CT13: Contenido existente', async () => {
            const contenidoMock = { id: 1 };
            contenidosRepo.getContenidoById.mockResolvedValue(contenidoMock);
            const result = await contenidosService.getContenidoById(1);
            expect(result).toEqual(contenidoMock);
        });
        it('CT14: Contenido inexistente', async () => {
            contenidosRepo.getContenidoById.mockResolvedValue(null);
            await expect(contenidosService.getContenidoById(9999))
                .rejects.toMatchObject({ status: 404, message: 'Contenido no encontrado' });
        });
    });
    // TEST - REORDENAMIENTO DE CONTENIDOS
    describe('reorderContenidos', () => {
        const contenidosValidos = [
            { id: 1, orden: 2 },
            { id: 2, orden: 1 },
        ];
        it('CT15: Reordenamiento exitoso', async () => {
            contenidosRepo.existContenidosByIds.mockResolvedValue([1, 2]);
            contenidosRepo.reorderContenidos.mockResolvedValue(contenidosValidos);
            const result = await contenidosService.reorderContenidos(contenidosValidos);
            expect(result).toEqual({
                message: 'Contenidos reordenados correctamente',
                count: contenidosValidos.length,
            });
            expect(contenidosRepo.reorderContenidos).toHaveBeenCalledWith(contenidosValidos);
        });
        it('CT16: Error por array vacío', async () => {
            await expect(contenidosService.reorderContenidos([]))
                .rejects.toMatchObject({ status: 400, message: 'Debe enviar al menos un contenido para reordenar' });
        });
        it('CT17: Error por contenido sin id o sin orden', async () => {
            const invalidContenidos = [
                { id: 1 }, // falta orden
                { orden: 2 },
            ];
            await expect(contenidosService.reorderContenidos(invalidContenidos))
                .rejects.toMatchObject({ status: 400, message: 'Cada contenido debe tener id y orden válidos' });
        });
        it('CT18: Error por contenido inexistente', async () => {
            const contenidos = [{ id: 1, orden: 1 }, { id: 2, orden: 2 }];
            contenidosRepo.existContenidosByIds.mockResolvedValue([1]);
            await expect(contenidosService.reorderContenidos(contenidos))
                .rejects.toMatchObject({ status: 404, message: 'Uno o más contenidos no existen' });
        });
        it('CT19: Error interno del repositorio', async () => {
            contenidosRepo.existContenidosByIds.mockResolvedValue([1, 2]);
            contenidosRepo.reorderContenidos.mockRejectedValue(new Error('Error al reordenar'));
            await expect(contenidosService.reorderContenidos(contenidosValidos))
                .rejects.toThrow('Error al reordenar');
        });
    });
});
