"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnershipOrAdmin = exports.requireRoles = void 0;
const roles_1 = require("@/types/roles");
const apiResponse_1 = require("../utils/apiResponse");
const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json(new apiResponse_1.ApiResponse(false, null, 'No autorizado'));
            }
            const userRole = req.user.rol;
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json(new apiResponse_1.ApiResponse(false, null, 'No tiene permisos para realizar esta acción'));
            }
            next();
        }
        catch (error) {
            console.error('Error en middleware de roles:', error);
            return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al verificar permisos'));
        }
    };
};
exports.requireRoles = requireRoles;
// Middleware para rutas que requieren ser el propietario o admin
const requireOwnershipOrAdmin = (paramName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json(new apiResponse_1.ApiResponse(false, null, 'No autorizado'));
            }
            const resourceId = parseInt(req.params[paramName]);
            const userRole = req.user.rol;
            const userId = req.user.id;
            // Los admins siempre tienen acceso
            if (userRole === roles_1.RolesEnum.ADMIN) {
                return next();
            }
            // Para otros roles, verificar si son propietarios del recurso
            if (userId === resourceId) {
                return next();
            }
            return res.status(403).json(new apiResponse_1.ApiResponse(false, null, 'No tiene permisos para realizar esta acción'));
        }
        catch (error) {
            console.error('Error en middleware de propiedad:', error);
            return res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al verificar permisos'));
        }
    };
};
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
