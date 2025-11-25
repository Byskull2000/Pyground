"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comentarios_controller_1 = require("../controllers/comentarios.controller");
const router = express_1.default.Router();
router.post('', comentarios_controller_1.getComentariosByTopico);
router.post('/publicar', comentarios_controller_1.createComentario);
exports.default = router;
