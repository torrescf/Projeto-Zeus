import { Request, Response } from 'express';
import { AppDataSource } from "../database/data-source";
import { Member } from '../database/entities/Member';

export const createMember = async (req: Request, res: Response) => {
    const { nomeCompleto, email, password, role, phone, gender, skills } = req.body;
    const photo = req.file?.path;
    try {
        if (!email.endsWith('@compjunior.com.br')) {
            return res.status(400).json({ message: 'O email deve pertencer ao domínio compjunior.com.br' });
        }
        const memberRepository = AppDataSource.getRepository(Member);
        const newMember = memberRepository.create({
            nomeCompleto,
            email,
            password: password || '',
            role: role || 'member',
            isActive: true,
            skills,
            gender,
            phone,
            photo
        });
        await memberRepository.save(newMember);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar membro', error });
    }
};

export const getMembers = async (req: Request, res: Response) => {
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const members = await memberRepository.find();
        // Remover o campo password do retorno
        const membersWithoutPassword = members.map(member => {
            const { password, ...rest } = member;
            return rest;
        });
        res.json(membersWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar membros', error });
    }
};

export const getMemberById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOne({ where: { id: parseInt(id) } });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar membro', error });
    }
};

export const updateMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nomeCompleto, email, password, role, phone, gender, skills } = req.body;
    const photo = req.file?.path;
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOne({ where: { id: parseInt(id) } });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
        Object.assign(member, { nomeCompleto, email, password, role, phone, gender, skills, photo });
        await memberRepository.save(member);
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar membro', error });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOne({ where: { id: parseInt(id) } });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
        if (!req.query.confirm || req.query.confirm !== 'true') {
            return res.status(400).json({
                message: 'Confirmação necessária para excluir o membro. Adicione ?confirm=true à URL.',
            });
        }
        await memberRepository.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir membro', error });
    }
};