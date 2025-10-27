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
exports.deactivateCurso = exports.publicateCurso = exports.getCursoById = exports.getCursos = void 0;
const cursoRepo = __importStar(require("../repositories/cursos.repository"));
const unidadPlantillaRepo = __importStar(require("../repositories/unidades.plantilla.repository"));
const topicoPlantillaRepo = __importStar(require("../repositories/topicos.plantilla.repository"));
const getCursos = async () => {
    const cursos = await cursoRepo.getAllCursos();
    return cursos.map(c => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        codigo_curso: c.codigo_curso,
        activo: c.activo ?? true,
        fecha_creacion: c.fecha_creacion,
        creado_por: c.creado_por,
        estado_publicado: c.estado_publicado
    }));
};
exports.getCursos = getCursos;
const getCursoById = async (id) => {
    const c = await cursoRepo.getCursoById(id);
    if (!c)
        return null;
    return {
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        codigo_curso: c.codigo_curso,
        activo: c.activo ?? true,
        fecha_creacion: c.fecha_creacion,
        creado_por: c.creado_por,
        estado_publicado: c.estado_publicado
    };
};
exports.getCursoById = getCursoById;
const publicateCurso = async (id) => {
    const curso = await cursoRepo.getCursoById(id);
    if (!curso)
        throw Object.assign(new Error('Curso no encontrado'), { status: 404 });
    const unidadesPlantillaListas = await unidadPlantillaRepo.getUnidadesPlantillaByCurso(id);
    if (unidadesPlantillaListas == null || unidadesPlantillaListas.length == 0)
        throw {
            status: 404, message: 'Este curso no tiene unidades listas'
        };
    const topicosPlantillaListos = await topicoPlantillaRepo.getTopicosPlantillaByCurso(id);
    if (topicosPlantillaListos == null || topicosPlantillaListos.length == 0)
        throw {
            status: 404, message: 'Este curso no tiene topicos listos'
        };
    const cursoPublicado = await cursoRepo.publicateCurso(id);
    return cursoPublicado;
};
exports.publicateCurso = publicateCurso;
const deactivateCurso = async (id) => {
    const curso = await cursoRepo.getCursoById(id);
    if (!curso)
        throw Object.assign(new Error('Curso no encontrado'), { status: 404 });
    const cursoArchivado = await cursoRepo.deactivateCurso(id);
    return cursoArchivado;
};
exports.deactivateCurso = deactivateCurso;
