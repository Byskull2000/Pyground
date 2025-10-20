"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCurso = exports.deactivateCurso = exports.publicateCurso = exports.getCursoById = exports.getAllCursos = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllCursos = async () => {
    return prisma_1.default.curso.findMany();
};
exports.getAllCursos = getAllCursos;
const getCursoById = async (id) => {
    return prisma_1.default.curso.findUnique({
        where: { id }
    });
};
exports.getCursoById = getCursoById;
const publicateCurso = async (id) => {
    return prisma_1.default.curso.update({
        where: { id },
        data: {
            estado_publicado: true,
            activo: true
        },
    });
};
exports.publicateCurso = publicateCurso;
const deactivateCurso = async (id) => {
    return prisma_1.default.curso.update({
        where: { id },
        data: {
            estado_publicado: false
        },
    });
};
exports.deactivateCurso = deactivateCurso;
const deleteCurso = async (id) => {
    return prisma_1.default.curso.update({
        where: { id },
        data: {
            activo: false
        },
    });
};
exports.deleteCurso = deleteCurso;
