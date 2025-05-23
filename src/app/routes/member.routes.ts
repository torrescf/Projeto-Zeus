import express from 'express';
import { createMember, getMembers, getMemberById, updateMember, deleteMember } from '../../controllers/MemberController';
import { isAdmin } from '../../middlewares/authMiddleware';
import { uploadPhoto } from '../../middlewares/uploadMiddleware';
import { check } from 'express-validator';
import { AppDataSource } from "../../database/data-source";
import { Member } from "../../database/entities/Member";

const router = express.Router();

// Rota pública para listar todos os membros (deve vir antes das rotas com parâmetros)
router.get('/list/members', async (req, res) => {
    try {
        await getMembers(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar membros', error });
    }
});

// Rota pública para deletar membro por ID
router.delete('/members-delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido. Use apenas números, exemplo: /members-delete/1' });
    }
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const result = await memberRepository.delete(id);
        if (result.affected && result.affected > 0) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: 'Membro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar membro', error: error instanceof Error ? error.message : error });
    }
});

// Rota pública para buscar membro por ID
router.get('/public/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOneBy({ id });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
        const { password, ...rest } = member;
        res.json(rest);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar membro', error });
    }
});

// CRUD de membros
router.post(
    '/',
    isAdmin,
    uploadPhoto,
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