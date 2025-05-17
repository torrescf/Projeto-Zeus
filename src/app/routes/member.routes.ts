import express from 'express';
import { createMember, getMembers, getMemberById, updateMember, deleteMember } from '../../controllers/MemberController';
import { isAdmin } from '../../middlewares/authMiddleware';
import { uploadPhoto } from '../../middlewares/uploadMiddleware';
import { check } from 'express-validator';

const router = express.Router();

// CRUD de membros
router.post(
    '/',
    isAdmin,
    uploadPhoto, // Usar diretamente o middleware configurado
    [
        check('nomeCompleto').notEmpty().withMessage('O nome completo é obrigatório.'),
        check('email').isEmail().withMessage('Email inválido.').matches(/@compjunior\.com\.br$/).withMessage('O email deve pertencer ao domínio compjunior.com.br.'),
        check('role').notEmpty().withMessage('O cargo é obrigatório.'),
        check('phone').notEmpty().withMessage('O telefone é obrigatório.'),
        check('gender').notEmpty().withMessage('O gênero é obrigatório.'),
        check('skills').isArray().withMessage('As habilidades devem ser uma lista.'),
    ],
    createMember
);
router.get('/', isAdmin, getMembers);
router.get('/:id', isAdmin, getMemberById);
router.put('/:id', isAdmin, uploadPhoto, updateMember);
router.delete('/:id', isAdmin, deleteMember);

export default router;