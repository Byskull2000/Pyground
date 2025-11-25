"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// back/src/routes/topicos.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const roleAuth_1 = require("../middleware/roleAuth");
const roles_1 = require("../types/roles");
const topicos_controller_1 = require("../controllers/topicos.controller");
const router = express_1.default.Router();
// Obtener tópicos por unidad
router.get('/unidad/:id_unidad', topicos_controller_1.getTopicosByUnidad);
// Obtener tópico por ID
router.get('/:id', topicos_controller_1.getTopicoById);
// Crear nuevo tópico
router.post('/unidad/:id_unidad', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), topicos_controller_1.createTopico);
router.put('/reordenar', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), topicos_controller_1.reorderTopicos);
// Actualizar tópico
router.put('/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), topicos_controller_1.updateTopico);
// Eliminar tópico 
router.delete('/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), topicos_controller_1.deleteTopico);
exports.default = router;
