import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Tipos de archivos permitidos
const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
const allowedVideoTypes = /mp4|avi|mov|mkv|webm/;

// Función para validar tipo de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp) y video (mp4, avi, mov, mkv, webm)'));
  }
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generar nombre único con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB límite por archivo
  },
  fileFilter: fileFilter
});

// Middleware para múltiples archivos
export const uploadMultiple = upload.array('file', 10); // Máximo 10 archivos, campo 'file'

// Middleware para un solo archivo
export const uploadSingle = upload.single('file');

export default upload;
