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
exports.reorderUnidades = exports.deactivateUnidad = exports.publicateUnidad = exports.restoreUnidad = exports.deleteUnidad = exports.updateUnidad = exports.createUnidad = exports.getUnidad = exports.getUnidadesByEdicion = void 0;
const unidadRepo = __importStar(require("../repositories/unidades.repository"));
const edicionRepo = __importStar(require("../repositories/ediciones.repository"));
const getUnidadesByEdicion = async (id_edicion) => {
    if (await edicionRepo.getEdicionById(id_edicion) == null)
        throw { status: 404, message: 'Edición no encontrada' };
    return unidadRepo.getUnidadesByEdicion(id_edicion);
};
exports.getUnidadesByEdicion = getUnidadesByEdicion;
const getUnidad = async (id) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad no encontrada' };
    return unidad;
};
exports.getUnidad = getUnidad;
const createUnidad = async (data) => {
    if (!data.titulo)
        throw { status: 400, message: 'El título es obligatorio' };
    if (!data.id_edicion)
        throw { status: 400, message: 'La edición es obligatoria' };
    if (await edicionRepo.getEdicionById(data.id_edicion) == null)
        throw { status: 404, message: 'Edición no encontrada' };
    if (data.orden === undefined)
        throw { status: 400, message: 'El orden es obligatorio' };
    if (await unidadRepo.getUnidadRedudante(data.id_edicion, data.titulo) != null)
        throw { status: 409, message: 'Ya existe una unidad con este titulo en este unidad' };
    return unidadRepo.createUnidad(data);
};
exports.createUnidad = createUnidad;
const updateUnidad = async (id, data) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad no encontrada' };
    return unidadRepo.updateUnidad(id, data);
};
exports.updateUnidad = updateUnidad;
const deleteUnidad = async (id) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad no encontrada' };
    return unidadRepo.deleteUnidad(id);
};
exports.deleteUnidad = deleteUnidad;
const restoreUnidad = async (id) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw { status: 404, message: 'Unidad no encontrada' };
    return unidadRepo.restoreUnidad(id);
};
exports.restoreUnidad = restoreUnidad;
const publicateUnidad = async (id) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw Object.assign(new Error('Unidad no encontrada'), { status: 404 });
    const unidadPublicada = await unidadRepo.publicateUnidad(id);
    return unidadPublicada;
};
exports.publicateUnidad = publicateUnidad;
const deactivateUnidad = async (id) => {
    const unidad = await unidadRepo.getUnidadById(id);
    if (!unidad)
        throw Object.assign(new Error('Unidad no encontrada'), { status: 404 });
    const unidadArchivado = await unidadRepo.deactivateUnidad(id);
    return unidadArchivado;
};
exports.deactivateUnidad = deactivateUnidad;
const reorderUnidades = async (unidades) => {
    if (!unidades || unidades.length === 0)
        throw { status: 400, message: 'Debe enviar al menos una unidad para reordenar' };
    for (const u of unidades) {
        if (!u.id || u.orden === undefined)
            throw { status: 400, message: 'Cada unidad debe tener id y orden válidos' };
    }
    const ids = unidades.map(u => u.id);
    const existentes = await unidadRepo.existUnidadesByIds(ids);
    if (existentes.length !== ids.length)
        throw { status: 404, message: 'Una o más unidades no existen' };
    const result = await unidadRepo.reorderUnidades(unidades);
    return { message: 'Unidades reordenadas correctamente', count: result.length };
};
exports.reorderUnidades = reorderUnidades;
