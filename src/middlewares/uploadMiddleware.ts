import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Use JPG ou PNG.'));
    }
  }
});

export const uploadPhoto = upload.single('photo');
