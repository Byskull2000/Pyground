"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_routes_1 = __importDefault(require("./usuarios.routes"));
const cursos_routes_1 = __importDefault(require("./cursos.routes"));
const ediciones_routes_1 = __importDefault(require("./ediciones.routes"));
const inscripciones_routes_1 = __importDefault(require("./inscripciones.routes"));
const unidades_plantilla_routes_1 = __importDefault(require("./unidades.plantilla.routes"));
const topicos_plantilla_routes_1 = __importDefault(require("./topicos.plantilla.routes"));
const apiRouter = (0, express_1.Router)();
// Rutas de usuarios
apiRouter.use('/usuarios', usuarios_routes_1.default);
// Rutas de cursos
apiRouter.use('/cursos', cursos_routes_1.default);
// Rutas de edicion de un curso
apiRouter.use('/ediciones', ediciones_routes_1.default);
// Rutas de inscripciones
apiRouter.use('/inscripciones', inscripciones_routes_1.default);
// Rutas de inscripciones
apiRouter.use('/unidades-plantilla', unidades_plantilla_routes_1.default);
// Rutas de tópicos plantilla
apiRouter.use('/topicos-plantilla', topicos_plantilla_routes_1.default);
exports.default = apiRouter;
