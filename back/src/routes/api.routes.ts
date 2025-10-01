import { Router } from "express";
import usuariosRouter from "./usuarios.routes";


const apiRouter = Router();

// Rutas de usuarios
apiRouter.use('/usuarios', usuariosRouter)




export default apiRouter