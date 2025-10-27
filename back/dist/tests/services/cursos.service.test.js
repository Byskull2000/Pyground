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
const cursoService = __importStar(require("../../services/cursos.service"));
const cursoRepo = __importStar(require("../../repositories/cursos.repository"));
const unidadPlantillaRepo = __importStar(require("../../repositories/unidades.plantilla.repository"));
const topicoPlantillaRepo = __importStar(require("../../repositories/topicos.plantilla.repository"));
// Mock del repositorio
jest.mock('../../repositories/cursos.repository');
jest.mock('../../repositories/unidades.plantilla.repository');
jest.mock('../../repositories/topicos.plantilla.repository');
describe('Cursos Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getCursos', () => {
        it('debe retornar todos los cursos', async () => {
            const mockCursos = [
                {
                    id: 1,
                    nombre: 'Python',
                    codigo_curso: 'PYT001',
                    descripcion: null,
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: null
                },
                {
                    id: 2,
                    nombre: 'Java',
                    codigo_curso: 'JAV002',
                    descripcion: null,
                    activo: true,
                    fecha_creacion: new Date(),
                    creado_por: null
                }
            ];
            cursoRepo.getAllCursos.mockResolvedValue(mockCursos);
            const result = await cursoService.getCursos();
            expect(result).toEqual(mockCursos);
            expect(cursoRepo.getAllCursos).toHaveBeenCalledTimes(1);
        });
        it('debe manejar errores del repositorio', async () => {
            cursoRepo.getAllCursos.mockRejectedValue(new Error('Database error'));
            await expect(cursoService.getCursos()).rejects.toThrow('Database error');
        });
    });
    describe('getCursoById', () => {
        it('VC1 - debe retornar un curso existente por id', async () => {
            const mockCurso = {
                id: 1,
                nombre: 'Python',
                codigo_curso: 'PYT001',
                descripcion: null,
                activo: true,
                fecha_creacion: new Date(),
                creado_por: null
            };
            cursoRepo.getCursoById.mockResolvedValue(mockCurso);
            const result = await cursoService.getCursoById(1);
            expect(result).toEqual(mockCurso);
            expect(cursoRepo.getCursoById).toHaveBeenCalledWith(1);
        });
        it('VC2 - debe retornar null si el curso no existe', async () => {
            cursoRepo.getCursoById.mockResolvedValue(null);
            const result = await cursoService.getCursoById(999);
            expect(result).toBeNull();
        });
        it('VC5 - debe propagar error si falla el repositorio', async () => {
            cursoRepo.getCursoById.mockRejectedValue(new Error('Database connection failed'));
            await expect(cursoService.getCursoById(123)).rejects.toThrow('Database connection failed');
        });
    });
    describe('publicateCurso', () => {
        it('PC1 - debe publicar un curso existente con unidades listas', async () => {
            const mockCurso = { id: 1, nombre: 'Python' };
            const mockUnidades = [{ id: 10, nombre: 'Unidad 1' }];
            const mockTopicos = [{ id: 10, nombre: 'Topico 1' }];
            const mockPublicado = { id: 1, nombre: 'Python', publicado: true };
            cursoRepo.getCursoById.mockResolvedValue(mockCurso);
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue(mockUnidades);
            topicoPlantillaRepo.getTopicosPlantillaByCurso.mockResolvedValue(mockTopicos);
            cursoRepo.publicateCurso.mockResolvedValue(mockPublicado);
            const result = await cursoService.publicateCurso(1);
            expect(result).toEqual(mockPublicado);
            expect(cursoRepo.getCursoById).toHaveBeenCalledWith(1);
            expect(unidadPlantillaRepo.getUnidadesPlantillaByCurso).toHaveBeenCalledWith(1);
            expect(topicoPlantillaRepo.getTopicosPlantillaByCurso).toHaveBeenCalledWith(1);
            expect(cursoRepo.publicateCurso).toHaveBeenCalledWith(1);
        });
        it('PC2 - debe lanzar error si el curso no existe', async () => {
            cursoRepo.getCursoById.mockResolvedValue(null);
            await expect(cursoService.publicateCurso(999))
                .rejects.toThrow('Curso no encontrado');
        });
        it('PC3 - debe lanzar error si no hay unidades listas', async () => {
            const mockCurso = { id: 1, nombre: 'Python' };
            cursoRepo.getCursoById.mockResolvedValue(mockCurso);
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue([]);
            await expect(cursoService.publicateCurso(1))
                .rejects.toMatchObject({ status: 404, message: 'Este curso no tiene unidades listas' });
        });
    });
    describe('deactivateCurso', () => {
        it('DC1 - debe desactivar un curso existente', async () => {
            const mockCurso = { id: 2, nombre: 'Java' };
            const mockArchivado = { id: 2, nombre: 'Java', activo: false };
            cursoRepo.getCursoById.mockResolvedValue(mockCurso);
            cursoRepo.deactivateCurso.mockResolvedValue(mockArchivado);
            const result = await cursoService.deactivateCurso(2);
            expect(result).toEqual(mockArchivado);
            expect(cursoRepo.getCursoById).toHaveBeenCalledWith(2);
            expect(cursoRepo.deactivateCurso).toHaveBeenCalledWith(2);
        });
        it('DC2 - debe lanzar error si el curso no existe', async () => {
            cursoRepo.getCursoById.mockResolvedValue(null);
            await expect(cursoService.deactivateCurso(999))
                .rejects.toThrow('Curso no encontrado');
        });
    });
});
