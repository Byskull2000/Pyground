"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopicoPlantilla = exports.updateTopicoPlantilla = exports.createTopicoPlantilla = exports.getTopicoPlantillaById = exports.getTopicosByUnidadPlantilla = void 0;
// back/src/services/topicos.plantilla.service.ts
const topicos_plantilla_repository_1 = __importDefault(require("../repositories/topicos.plantilla.repository"));
const getTopicosByUnidadPlantilla = async (id_unidad_plantilla) => {
    return await topicos_plantilla_repository_1.default.getTopicosByUnidadPlantilla(id_unidad_plantilla);
};
exports.getTopicosByUnidadPlantilla = getTopicosByUnidadPlantilla;
const getTopicoPlantillaById = async (id) => {
    const topico = await topicos_plantilla_repository_1.default.getTopicoPlantillaById(id);
    if (!topico) {
        throw new Error('Tópico no encontrado');
    }
    return topico;
};
exports.getTopicoPlantillaById = getTopicoPlantillaById;
const createTopicoPlantilla = async (id_unidad_plantilla, data) => {
    // Obtener el siguiente orden
    const maxOrden = await topicos_plantilla_repository_1.default.getMaxOrden(id_unidad_plantilla);
    const nuevoOrden = maxOrden + 1;
    const topicoData = {
        id_unidad_plantilla,
        titulo: data.titulo,
        descripcion: data.descripcion,
        duracion_estimada: data.duracion_estimada,
        orden: nuevoOrden,
        version: data.version,
        publicado: false,
        objetivos_aprendizaje: data.objetivos_aprendizaje,
        activo: true
    };
    return await topicos_plantilla_repository_1.default.createTopicoPlantilla(topicoData);
};
exports.createTopicoPlantilla = createTopicoPlantilla;
const updateTopicoPlantilla = async (id, data) => {
    // Verificar que el tópico existe
    const topicoExistente = await topicos_plantilla_repository_1.default.getTopicoPlantillaById(id);
    if (!topicoExistente) {
        throw new Error('Tópico no encontrado');
    }
    return await topicos_plantilla_repository_1.default.updateTopicoPlantilla(id, data);
};
exports.updateTopicoPlantilla = updateTopicoPlantilla;
const deleteTopicoPlantilla = async (id) => {
    // Verificar que el tópico existe
    const topicoExistente = await topicos_plantilla_repository_1.default.getTopicoPlantillaById(id);
    if (!topicoExistente) {
        throw new Error('Tópico no encontrado');
    }
    // Verificar que esté activo
    if (!topicoExistente.activo) {
        throw new Error('El tópico ya está inactivo');
    }
    return await topicos_plantilla_repository_1.default.deleteTopicoPlantilla(id);
};
exports.deleteTopicoPlantilla = deleteTopicoPlantilla;
