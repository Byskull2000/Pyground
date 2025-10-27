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
const express_1 = require("express");
const unidadController = __importStar(require("../controllers/unidades.controller"));
const auth_1 = require("@/middleware/auth");
const roleAuth_1 = require("@/middleware/roleAuth");
const roles_1 = require("@/types/roles");
const router = (0, express_1.Router)();
router.get('/edicion/:id_edicion', unidadController.getUnidadesByEdicion);
router.get('/:id', unidadController.getUnidad);
router.post('/', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.createUnidad);
router.put('/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.updateUnidad);
router.delete('/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.deleteUnidad);
router.put('/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.updateUnidad);
router.put('/restaurar/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.restoreUnidad);
router.put('/publicar/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.publicateUnidad);
router.put('/desactivar/:id', auth_1.authRequired, (0, roleAuth_1.requireRoles)([roles_1.RolesEnum.ADMIN, roles_1.RolesEnum.ACADEMICO]), unidadController.deactivateUnidad);
exports.default = router;
