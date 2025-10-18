import { Router } from "express";
import usuariosRouter from "./usuarios.routes";
import cursosRouter from "./cursos.routes";
import edicionesRouter from "./ediciones.routes";
import inscripcionesRouter from "./inscripciones.routes";

const apiRouter = Router();

// Rutas de usuarios
apiRouter.use('/usuarios', usuariosRouter)

// Rutas de cursos
apiRouter.use('/cursos', cursosRouter)

// Rutas de edicion de un curso
apiRouter.use('/ediciones', edicionesRouter)

// Rutas de inscripciones
apiRouter.use('/inscripciones', inscripcionesRouter)

export default apiRouter