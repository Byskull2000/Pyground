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
exports.assignRolUsuario = exports.deleteUsuario = exports.updateUsuario = exports.createUsuario = exports.getUsuarioById = exports.getUsuarios = void 0;
const userService = __importStar(require("../services/usuarios.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getUsuarios = async (_req, res) => {
    try {
        const usuarios = await userService.getUsuarios();
        res.json(new apiResponse_1.ApiResponse(true, usuarios));
    }
    catch {
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener usuarios'));
    }
};
exports.getUsuarios = getUsuarios;
const getUsuarioById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const usuario = await userService.getUsuario(id);
        if (!usuario)
            return res.status(404).json(new apiResponse_1.ApiResponse(false, null, 'Usuario no encontrado'));
        res.json(new apiResponse_1.ApiResponse(true, usuario));
    }
    catch {
        res.status(500).json(new apiResponse_1.ApiResponse(false, null, 'Error al obtener usuario'));
    }
};
exports.getUsuarioById = getUsuarioById;
const createUsuario = async (req, res) => {
    try {
        const usuario = await userService.createUsuario(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse(true, usuario));
    }
    catch (err) {
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear usuario';
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createUsuario = createUsuario;
const updateUsuario = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const usuario = await userService.updateUsuario(id, req.body);
        res.json(new apiResponse_1.ApiResponse(true, usuario));
    }
    catch (err) {
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al actualizar usuario';
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await userService.deleteUsuario(id);
        res.json(new apiResponse_1.ApiResponse(true, { message: 'Usuario eliminado correctamente' }));
    }
    catch (err) {
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al eliminar usuario';
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.deleteUsuario = deleteUsuario;
const assignRolUsuario = async (req, res) => {
    const id = Number(req.params.id);
    const { rol } = req.body;
    try {
        const result = await userService.assignRol(id, rol);
        res.json(new apiResponse_1.ApiResponse(true, result, null));
    }
    catch (err) {
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al asignar rol';
        res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.assignRolUsuario = assignRolUsuario;
