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
exports.createComentario = exports.getComentariosByTopico = void 0;
const comentarioService = __importStar(require("../services/comentarios.service"));
const apiResponse_1 = require("../utils/apiResponse");
const getComentariosByTopico = async (req, res) => {
    try {
        const data = req.body;
        const comentarioes = await comentarioService.getComentariosByTopico(data);
        return res.json(new apiResponse_1.ApiResponse(true, comentarioes));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al obtener comentarioes';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.getComentariosByTopico = getComentariosByTopico;
const createComentario = async (req, res) => {
    try {
        const data = req.body;
        const newComentario = await comentarioService.createComentario(data);
        return res.status(201).json(new apiResponse_1.ApiResponse(true, newComentario));
    }
    catch (err) {
        console.error(err);
        const status = err?.status ?? 500;
        const message = err?.message ?? 'Error al crear comentario';
        return res.status(status).json(new apiResponse_1.ApiResponse(false, null, message));
    }
};
exports.createComentario = createComentario;
