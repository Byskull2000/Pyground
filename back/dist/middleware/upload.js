"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = exports.uploadMultiple = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Tipos de archivos permitidos
const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
const allowedVideoTypes = /mp4|avi|mov|mkv|webm/;
// Función para validar tipo de archivo
const fileFilter = (req, file, cb) => {
    const extname = allowedImageTypes.test(path_1.default.extname(file.originalname).toLowerCase()) ||
        allowedVideoTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp) y video (mp4, avi, mov, mkv, webm)'));
    }
};
// Configuración de almacenamiento
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generar nombre único con timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Configuración de multer
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB límite por archivo
    },
    fileFilter: fileFilter
});
// Middleware para múltiples archivos
exports.uploadMultiple = upload.array('file', 10); // Máximo 10 archivos, campo 'file'
// Middleware para un solo archivo
exports.uploadSingle = upload.single('file');
exports.default = upload;
