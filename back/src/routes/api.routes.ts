import { Router } from "express";
import usuariosRouter from "./usuarios.routes";
import cursosRouter from "./cursos.routes";


const apiRouter = Router();

// Rutas de usuarios
apiRouter.use('/usuarios', usuariosRouter)

// Rutas de cursos
apiRouter.use('/cursos', cursosRouter)


export default apiRouter