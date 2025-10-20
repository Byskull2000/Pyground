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
const edicionService = __importStar(require("../../services/ediciones.service"));
const edicionRepo = __importStar(require("../../repositories/ediciones.repository"));
const unidadPlantillaRepo = __importStar(require("../../repositories/unidades.plantilla.repository"));
const unidadRepo = __importStar(require("../../repositories/unidades.repository"));
const cursoRepo = __importStar(require("../../repositories/cursos.repository"));
jest.mock('../../repositories/ediciones.repository');
jest.mock('../../repositories/cursos.repository');
jest.mock('../../repositories/unidades.repository');
jest.mock('../../repositories/unidades.plantilla.repository');
describe('Ediciones Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createEdicion', () => {
        it('ED1: Creación exitosa de una edición', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición 2025',
                descripcion: 'Descripción opcional',
                fecha_apertura: new Date('2025-01-01'),
                fecha_cierre: new Date('2025-12-31'),
                creado_por: 'admin@correo.com'
            };
            const createdEdicion = {
                id: 1,
                ...newEdicion,
                activo: true,
                fecha_creacion: new Date(),
                curso: { id: 1, nombre: 'Curso 1' },
                unidades: []
            };
            cursoRepo.getCursoById.mockResolvedValue({ id: 1, nombre: 'Curso 1', estado_publicado: true });
            edicionRepo.getEdicionesByCursoAndNombre.mockResolvedValue([]);
            edicionRepo.createEdicion.mockResolvedValue(createdEdicion);
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue([]);
            edicionRepo.getEdicionById.mockResolvedValue(createdEdicion);
            const result = await edicionService.createEdicion(newEdicion);
            expect(result).toEqual(createdEdicion);
            expect(edicionRepo.createEdicion).toHaveBeenCalledWith(newEdicion);
            expect(edicionRepo.getEdicionById).toHaveBeenCalledWith(createdEdicion.id);
        });
        it('ED2: Faltan campos obligatorios', async () => {
            const newEdicion = {
                fecha_apertura: new Date(),
                fecha_cierre: new Date()
            };
            await expect(edicionService.createEdicion(newEdicion))
                .rejects.toMatchObject({ status: 400, message: 'El nombre de la edición es obligatorio' });
        });
        it('ED3: Curso inexistente', async () => {
            const newEdicion = {
                id_curso: 9999,
                nombre_edicion: 'Edición Fantasma',
                fecha_apertura: new Date('2025-01-01'),
                fecha_cierre: new Date('2025-12-31'),
                creado_por: 'admin@correo.com'
            };
            edicionRepo.createEdicion.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
            await expect(edicionService.createEdicion(newEdicion))
                .rejects.toMatchObject({ status: 404, message: 'Curso no encontrado' });
        });
        it('ED4: Fecha de apertura inválida', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición Inválida',
                fecha_apertura: 'texto inválido',
                fecha_cierre: new Date('2025-12-31'),
                creado_por: 'admin@correo.com'
            };
            await expect(edicionService.createEdicion(newEdicion))
                .rejects.toMatchObject({ status: 400, message: 'La fecha de apertura es inválida' });
        });
        it('ED5: Duplicado de edición dentro del mismo curso', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición Duplicada',
                fecha_apertura: new Date('2025-01-01'),
                fecha_cierre: new Date('2025-12-31'),
                creado_por: 'admin@correo.com'
            };
            cursoRepo.getCursoById.mockResolvedValue({ id: 1, nombre: 'Curso 1', estado_publicado: true });
            edicionRepo.getEdicionesByCursoAndNombre.mockResolvedValue([{ id: 99, ...newEdicion }]);
            await expect(edicionService.createEdicion(newEdicion))
                .rejects.toMatchObject({ status: 409, message: 'Ya existe una edición con ese nombre para este curso' });
        });
        it('ED6: Fecha de cierre antes de la apertura', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Edición Mal Fechada',
                fecha_apertura: new Date('2025-12-31'),
                fecha_cierre: new Date('2025-01-01'),
                creado_por: 'admin@correo.com'
            };
            await expect(edicionService.createEdicion(newEdicion))
                .rejects.toMatchObject({ status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' });
        });
        it('ED11: Creación de unidades desde la plantilla del curso al crear una edicion', async () => {
            const newEdicion = {
                id_curso: 1,
                nombre_edicion: 'Curso 2025-I',
                descripcion: 'Curso del primer semestre del 2025',
                fecha_apertura: new Date('2025-01-01'),
                fecha_cierre: new Date('2025-12-31'),
                creado_por: 'admin@correo.com'
            };
            const EdicionBase = { id: 10, ...newEdicion, activo: true, fecha_creacion: new Date() };
            const unidadesPlantilla = [
                { id: 101, titulo: 'Unidad 1', descripcion: 'Descripcion 1', orden: 1, icono: 'icono 1', color: 'red' },
                { id: 102, titulo: 'Unidad 2', descripcion: 'Descripcion 2', orden: 2, icono: 'icono 2', color: 'green' },
                { id: 103, titulo: 'Unidad 3', descripcion: 'Descripcion 3', orden: 3, icono: 'icono 3', color: 'blue' },
            ];
            const createdEdicion = {
                ...EdicionBase,
                curso: { id: 1, nombre: 'Curso 1' },
                unidades: [
                    { id: 201, id_edicion: 10, titulo: 'Unidad 1', orden: 1 },
                    { id: 202, id_edicion: 10, titulo: 'Unidad 2', orden: 2 },
                    { id: 203, id_edicion: 10, titulo: 'Unidad 3', orden: 3 },
                ]
            };
            cursoRepo.getCursoById.mockResolvedValue({ id: 1, nombre: 'Curso 1', estado_publicado: true });
            edicionRepo.getEdicionesByCursoAndNombre.mockResolvedValue([]);
            edicionRepo.createEdicion.mockResolvedValue(createdEdicion);
            unidadPlantillaRepo.getUnidadesPlantillaByCurso.mockResolvedValue(unidadesPlantilla);
            unidadRepo.cloneFromPlantillas.mockResolvedValue(true);
            edicionRepo.getEdicionById.mockResolvedValue(createdEdicion);
            const result = await edicionService.createEdicion(newEdicion);
            expect(result).toEqual(createdEdicion);
            expect(edicionRepo.createEdicion).toHaveBeenCalledWith(newEdicion);
            expect(unidadPlantillaRepo.getUnidadesPlantillaByCurso).toHaveBeenCalledWith(1);
            expect(unidadRepo.cloneFromPlantillas).toHaveBeenCalledWith(unidadesPlantilla, createdEdicion.id);
            expect(edicionRepo.getEdicionById).toHaveBeenCalledWith(EdicionBase.id);
        });
    });
    describe('getEdicionesByCurso', () => {
        it('Debe retornar lista de ediciones para un curso existente', async () => {
            const mockEdiciones = [
                { id: 1, nombre_edicion: 'Edición 1', id_curso: 1, fecha_apertura: new Date(), fecha_cierre: new Date(), creado_por: 'admin@correo.com' },
                { id: 2, nombre_edicion: 'Edición 2', id_curso: 1, fecha_apertura: new Date(), fecha_cierre: new Date(), creado_por: 'admin@correo.com' }
            ];
            edicionRepo.getEdicionesByCurso.mockResolvedValue(mockEdiciones);
            const result = await edicionService.getEdicionesByCurso(1);
            expect(result).toEqual(mockEdiciones);
            expect(edicionRepo.getEdicionesByCurso).toHaveBeenCalledWith(1);
        });
        it('Debe retornar lista vacía si no hay ediciones', async () => {
            edicionRepo.getEdicionesByCurso.mockResolvedValue([]);
            const result = await edicionService.getEdicionesByCurso(2);
            expect(result).toEqual([]);
            expect(edicionRepo.getEdicionesByCurso).toHaveBeenCalledWith(2);
        });
        it('Debe manejar error del repositorio', async () => {
            edicionRepo.getEdicionesByCurso.mockRejectedValue(new Error('DB error'));
            await expect(edicionService.getEdicionesByCurso(1)).rejects.toThrow('DB error');
        });
    });
});
