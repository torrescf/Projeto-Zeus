// Middleware para upload de arquivos, com validação de tipo e tamanho.
// Suporta apenas imagens nos formatos JPG e PNG.

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      return cb(new Error('Apenas arquivos .jpg, .jpeg e .png são permitidos'));
    }
    cb(null, true);
  },
});

// Exporte tanto o middleware configurado quanto o upload básico
export const uploadPhoto = upload.single('photo');
export const uploadMiddleware = upload; // Exportação adicional para uso geral
