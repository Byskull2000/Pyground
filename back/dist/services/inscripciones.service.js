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
exports.deleteInscripcion = exports.updateInscripcion = exports.createInscripcion = exports.getInscripcionStatus = exports.getInscripcionesByUsuario = exports.getInscripcion = exports.getEstudiantesByEdicion = exports.getInscripcionesByEdicion = void 0;
const inscripcionRepo = __importStar(require("../repositories/inscripciones.repository"));
const usuarioRepo = __importStar(require("../repositories/usuarios.repository"));
const edicionRepo = __importStar(require("../repositories/ediciones.repository"));
const cargoRepo = __importStar(require("../repositories/cargos.repository"));
const getInscripcionesByEdicion = (id_edicion) => {
    return inscripcionRepo.getInscripcionesByEdicion(id_edicion);
};
exports.getInscripcionesByEdicion = getInscripcionesByEdicion;
const getEstudiantesByEdicion = (id_edicion) => {
    return inscripcionRepo.getEstudiantesByEdicion(id_edicion);
};
exports.getEstudiantesByEdicion = getEstudiantesByEdicion;
const getInscripcion = async (id) => {
    const inscripcion = await inscripcionRepo.getInscripcionById(id);
    if (!inscripcion)
        throw { status: 404, message: 'Inscripción no encontrada' };
    return inscripcion;
};
exports.getInscripcion = getInscripcion;
const getInscripcionesByUsuario = async (id) => {
    const usuarioValido = await usuarioRepo.getUsuarioById(id);
    if (!usuarioValido)
        throw { status: 404, message: 'El usuario no pudo ser encontrado' };
    const inscripciones = await inscripcionRepo.getInscripcionesByUsuario(id);
    if (!inscripciones)
        throw { status: 404, message: 'Inscripciones no encontradas para el usuario' };
    return inscripciones;
};
exports.getInscripcionesByUsuario = getInscripcionesByUsuario;
const getInscripcionStatus = async (usuario_id, edicion_id) => {
    const usuarioValido = await usuarioRepo.getUsuarioById(usuario_id);
    if (!usuarioValido)
        throw { status: 404, message: 'El usuario no pudo ser encontrado' };
    const edicionValida = await edicionRepo.getEdicionById(edicion_id);
    if (!edicionValida)
        throw { status: 404, message: 'El curso no fue encontrado' };
    const inscripcion = await inscripcionRepo.getInscripcionStatus(usuario_id, edicion_id);
    if (!inscripcion)
        throw { status: 404, message: 'El usuario no esta inscrito a este curso' };
    return inscripcion;
};
exports.getInscripcionStatus = getInscripcionStatus;
const createInscripcion = async (data) => {
    if (!data.usuario_id)
        throw { status: 400, message: 'El usuario es obligatorio' };
    if (!data.edicion_id)
        throw { status: 400, message: 'La edición es obligatoria' };
    if (!data.cargo_id)
        throw { status: 400, message: 'El cargo es obligatorio' };
    const usuario = await usuarioRepo.getUsuarioById(data.usuario_id);
    if (!usuario)
        throw { status: 404, message: 'Usuario no encontrado o inactivo' };
    const edicion = await edicionRepo.getEdicionById(data.edicion_id);
    if (!edicion || !edicion.activo)
        throw { status: 404, message: 'Edición no encontrada o inactiva' };
    const cargo = await cargoRepo.getCargoById(data.cargo_id);
    if (!cargo)
        throw { status: 404, message: 'Cargo no encontrado' };
    if (!edicion.estado_publicado && cargo.nombre.toLowerCase() === "estudiante")
        throw { status: 409, message: 'La edición no esta abierta a inscripciones' };
    const existentes = await inscripcionRepo.getInscripcionesByEdicion(data.edicion_id);
    const duplicada = existentes.find(i => i.usuario_id === data.usuario_id);
    if (duplicada)
        throw { status: 409, message: 'El usuario ya está inscrito en esta edición' };
    try {
        const nueva = await inscripcionRepo.createInscripcion(data);
        return inscripcionRepo.getInscripcionById(nueva.id);
    }
    catch {
        throw { status: 500, message: 'Error al registrar la inscripción' };
    }
};
exports.createInscripcion = createInscripcion;
const updateInscripcion = async (id, data) => {
    const inscripcion = await inscripcionRepo.getInscripcionById(id);
    if (!inscripcion)
        throw { status: 404, message: 'Inscripción no encontrada' };
    return inscripcionRepo.updateInscripcion(id, data);
};
exports.updateInscripcion = updateInscripcion;
const deleteInscripcion = async (id) => {
    const inscripcion = await inscripcionRepo.getInscripcionById(id);
    if (!inscripcion)
        throw { status: 404, message: 'Inscripción no encontrada' };
    return inscripcionRepo.deleteInscripcion(id);
};
exports.deleteInscripcion = deleteInscripcion;
