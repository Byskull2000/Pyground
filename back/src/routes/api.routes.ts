import { Router } from "express";
import usuariosRouter from "./usuarios.routes";
import cursosRouter from "./cursos.routes";
import edicionesRouter from "./ediciones.routes";
import inscripcionesRouter from "./inscripciones.routes";
import unidadesPlantillaRouter from "./unidades.plantilla.routes";
import unidadesRouter from "./unidades.routes";
import topicosPlantillaRouter from "./topicos.plantilla.routes";
import topicosRouter from "./topicos.routes";
import contenidosRouter from "./contenidos.routes";
import comentariosRouter from "./comentarios.routes";

const apiRouter = Router();

// Rutas de usuarios
apiRouter.use('/usuarios', usuariosRouter)

// Rutas de cursos
apiRouter.use('/cursos', cursosRouter)

// Rutas de edicion de un curso
apiRouter.use('/ediciones', edicionesRouter)

// Rutas de inscripciones
apiRouter.use('/inscripciones', inscripcionesRouter)

// Rutas de unidades plantilla
apiRouter.use('/unidades-plantilla', unidadesPlantillaRouter)

// Rutas de unidades
apiRouter.use('/unidades', unidadesRouter)

// Rutas de tópicos plantilla
apiRouter.use('/topicos-plantilla', topicosPlantillaRouter)

// Rutas de tópicos
apiRouter.use('/topicos', topicosRouter)

// Rutas de tópicos
apiRouter.use('/contenidos', contenidosRouter)

// Rutas de tópicos
apiRouter.use('/comentarios', comentariosRouter)

export default apiRouter