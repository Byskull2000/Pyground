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
router.use(auth_1.authRequired);
router.use((0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN]));
router.get('/unidad/:id_unidad_plantilla', topicos_plantilla_controller_1.getTopicosByUnidadPlantilla);
router.post('/unidad/:id_unidad_plantilla', topicos_plantilla_controller_1.createTopicoPlantilla);
router.put('/:id', topicos_plantilla_controller_1.updateTopicoPlantilla);
router.delete('/:id', topicos_plantilla_controller_1.deleteTopicoPlantilla);
exports.default = router;
