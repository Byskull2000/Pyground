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
exports.deleteEdicion = exports.updateEdicion = exports.createEdicion = exports.getEdicion = exports.getEdicionesByCurso = void 0;
const edicionRepo = __importStar(require("../repositories/ediciones.repository"));
const cursoRepo = __importStar(require("../repositories/cursos.repository"));
const unidadPlantillaRepo = __importStar(require("../repositories/unidades.plantilla.repository"));
//import * as topicoPlantillaRepo from '../repositories/topicos.plantilla.repository';
//import * as topicoRepo from '../repositories/topicos.repository';
const unidadRepo = __importStar(require("../repositories/unidades.repository"));
const inscripcionRepo = __importStar(require("../repositories/inscripciones.repository"));
const usuarioRepo = __importStar(require("../repositories/usuarios.repository"));
const getEdicionesByCurso = (id_curso) => {
    return edicionRepo.getEdicionesByCurso(id_curso);
};
exports.getEdicionesByCurso = getEdicionesByCurso;
const getEdicion = async (id) => {
    const edicion = await edicionRepo.getEdicionById(id);
    if (!edicion)
        throw { status: 404, message: 'Edición no encontrada' };
    return edicion;
};
exports.getEdicion = getEdicion;
const createEdicion = async (data) => {
    if (!data.nombre_edicion)
        throw { status: 400, message: 'El nombre de la edición es obligatorio' };
    if (!data.id_curso)
        throw { status: 400, message: 'El curso es obligatorio' };
    if (!data.fecha_apertura || isNaN(new Date(data.fecha_apertura).getTime()))
        throw { status: 400, message: 'La fecha de apertura es inválida' };
    if (data.fecha_cierre && isNaN(new Date(data.fecha_cierre).getTime()))
        throw { status: 400, message: 'La fecha de cierre es inválida' };
    if (data.fecha_cierre && new Date(data.fecha_apertura) > new Date(data.fecha_cierre))
        throw { status: 400, message: 'La fecha de apertura no puede ser mayor a la fecha de cierre' };
    const curso = await cursoRepo.getCursoById(data.id_curso);
    if (!curso)
        throw Object.assign(new Error('Curso no encontrado'), { status: 404 });
    if (!curso.estado_publicado)
        throw Object.assign(new Error('Curso no publicado'), { status: 404 });
    const existente = await edicionRepo.getEdicionesByCursoAndNombre(data.id_curso, data.nombre_edicion);
    if (existente.length > 0)
        throw Object.assign(new Error('Ya existe una edición con ese nombre para este curso'), { status: 409 });
    const nuevaEdicion = await edicionRepo.createEdicion(data);
    // Crear unidades (y cotenidos) de acuerdo a las unidades plantilla del curso
    const unidadesPlantilla = await unidadPlantillaRepo.getUnidadesPlantillaByCurso(data.id_curso);
    if (unidadesPlantilla != null && unidadesPlantilla.length > 0) {
        await unidadRepo.cloneFromPlantillas(unidadesPlantilla, nuevaEdicion.id);
    }
    /*
      const topicosPlantilla = await topicoPlantillaRepo.getTopicosPlantillaByCurso(data.id_curso);
    
      if (topicosPlantilla != null && topicosPlantilla.length > 0) {
        await topicoRepo.cloneFromPlantillas(topicosPlantilla, nuevaEdicion.id);
      }*/
    if (data.id_creador != null && data.id_creador > 0) {
        const usuarioValido = await usuarioRepo.getUsuarioById(data.id_creador);
        if (usuarioValido != null) {
            await inscripcionRepo.createDocenteEdicion(nuevaEdicion.id, usuarioValido.id);
        }
    }
    const edicionCreada = await edicionRepo.getEdicionById(nuevaEdicion.id);
    return edicionCreada;
};
exports.createEdicion = createEdicion;
const updateEdicion = async (id, data) => {
    const edicion = await edicionRepo.getEdicionById(id);
    if (!edicion)
        throw { status: 404, message: 'Edición no encontrada' };
    return edicionRepo.updateEdicion(id, data);
};
exports.updateEdicion = updateEdicion;
const deleteEdicion = async (id) => {
    const edicion = await edicionRepo.getEdicionById(id);
    if (!edicion)
        throw { status: 404, message: 'Edición no encontrada' };
    return edicionRepo.deleteEdicion(id);
};
exports.deleteEdicion = deleteEdicion;
