"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else {
            cb(new Error('Formato de arquivo inválido. Use JPG ou PNG.'));
        }
    }
});
exports.uploadPhoto = upload.single('photo');
//# sourceMappingURL=uploadMiddleware.js.map