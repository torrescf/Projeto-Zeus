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
        check('dataNascimento').isDate().withMessage('Data de nascimento inválida.').custom(value => {
            if (new Date(value) >= new Date()) {
                throw new Error('A data de nascimento deve ser anterior à data atual.');
            }
            return true;
        }),
        check('emailInstitucional').isEmail().withMessage('Email inválido.').matches(/@compjunior\.ufl\.edu\.br$/).withMessage('O email deve pertencer ao domínio compjunior.ufl.edu.br.'),
        check('cargo').notEmpty().withMessage('O cargo é obrigatório.'),
        check('telefone').notEmpty().withMessage('O telefone é obrigatório.'),
        check('genero').notEmpty().withMessage('O gênero é obrigatório.'),
        check('dataIngresso').isDate().withMessage('Data de ingresso inválida.').custom(value => {
            if (new Date(value) >= new Date()) {
                throw new Error('A data de ingresso deve ser anterior à data atual.');
            }
            return true;
        }),
        check('habilidades').isArray().withMessage('As habilidades devem ser uma lista.'),
    ],
    createMember
);
router.get('/', isAdmin, getMembers);
router.get('/:id', isAdmin, getMemberById);
router.put('/:id', isAdmin, uploadPhoto, updateMember);
router.delete('/:id', isAdmin, deleteMember);

export default router;