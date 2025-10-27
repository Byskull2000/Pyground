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
exports.deleteUnidadPlantilla = exports.updateUnidadPlantilla = exports.createUnidadPlantilla = exports.getUnidadPlantilla = exports.getUnidadesPlantilla = void 0;
const unidadPlantillaRepo = __importStar(require("../repositories/unidades.plantilla.repository"));
const cursoRepo = __importStar(require("../repositories/cursos.repository"));
const getUnidadesPlantilla = async (id_curso) => {
    if (await cursoRepo.getCursoById(id_curso) == null)
        throw { status: 404, message: 'Curso no encontrado' };
    return unidadPlantillaRepo.getUnidadesPlantillaByCurso(id_curso);
};
exports.getUnidadesPlantilla = getUnidadesPlantilla;
const getUnidadPlantilla = async (id) => {
    const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad plantilla no encontrada' };
    return unidad;
};
exports.getUnidadPlantilla = getUnidadPlantilla;
const createUnidadPlantilla = async (data) => {
    if (!data.titulo)
        throw { status: 400, message: 'El título es obligatorio' };
    if (!data.id_curso)
        throw { status: 400, message: 'El curso es obligatorio' };
    if (!data.orden || data.orden === undefined)
        throw { status: 400, message: 'El orden es obligatorio' };
    if (await unidadPlantillaRepo.getUnidadPlantillaRedudante(data.id_curso, data.titulo) != null)
        throw { status: 409, message: 'Ya existe una unidad con ese nombre para este curso' };
    return unidadPlantillaRepo.createUnidadPlantilla({
        ...data,
        version: data.version ?? 1,
        activo: data.activo ?? true
    });
};
exports.createUnidadPlantilla = createUnidadPlantilla;
const updateUnidadPlantilla = async (id, data) => {
    const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad plantilla no encontrada' };
    return unidadPlantillaRepo.updateUnidadPlantilla(id, data);
};
exports.updateUnidadPlantilla = updateUnidadPlantilla;
const deleteUnidadPlantilla = async (id) => {
    const unidad = await unidadPlantillaRepo.getUnidadPlantillaById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad plantilla no encontrada' };
    return unidadPlantillaRepo.updateUnidadPlantilla(id, { activo: false });
};
exports.deleteUnidadPlantilla = deleteUnidadPlantilla;
