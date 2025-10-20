"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// back/src/routes/topicos.plantilla.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const roleAuth_1 = require("../middleware/roleAuth");
const roles_1 = require("../types/roles");
const topicos_plantilla_controller_1 = require("../controllers/topicos.plantilla.controller");
const router = express_1.default.Router();
// Todos estos endpoints requieren autenticación y rol de ADMIN
router.use(auth_1.authRequired);
router.use((0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN]));
// Obtener tópicos por unidad plantilla
router.get('/unidad/:id_unidad_plantilla', topicos_plantilla_controller_1.getTopicosByUnidadPlantilla);
// Crear nuevo tópico plantilla
router.post('/unidad/:id_unidad_plantilla', topicos_plantilla_controller_1.createTopicoPlantilla);
// Actualizar tópico plantilla
router.put('/:id', topicos_plantilla_controller_1.updateTopicoPlantilla);
// Eliminar tópico plantilla (soft delete)
router.delete('/:id', topicos_plantilla_controller_1.deleteTopicoPlantilla);
exports.default = router;
