import express from 'express';
import { createMember, getMembers, getMemberById, updateMember, deleteMember } from '../../controllers/MemberController';
import { isAdmin } from '../../middlewares/authMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { uploadPhoto } from '../../middlewares/uploadMiddleware';
import { check } from 'express-validator';
import { AppDataSource } from "../../database/data-source";
import { Member } from "../../database/entities/Member";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dqalvfs9e',
  api_key: '481816896419698',
  api_secret: 'RZY2bnvKSU2puaSLMo32GqO0nRU',
});

const router = express.Router();

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

// Rota pública para listar todos os membros sem senha
import { getPublicAll } from '../../controllers/MemberController';
router.get('/public', getPublicAll);

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
router.put('/:id', authMiddleware, uploadPhoto, (req, res) => updateMember(req, res));
router.delete('/:id', isAdmin, deleteMember);

// Rota para upload de foto do membro
router.post('/upload-photo/:id', authMiddleware, uploadPhoto, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }
    try {
        // Upload para Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'members',
            public_id: `member_${req.params.id}`,
            overwrite: true
        });
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOneBy({ id: req.params.id });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
        member.photo = result.secure_url;
        await memberRepository.save(member);
        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar imagem para o Cloudinary', error });
    }
});

export default router;