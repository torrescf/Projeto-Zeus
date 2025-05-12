import { Request, Response } from 'express';
import { AppDataSource } from "../database/data-source";
import { Member } from '../database/entities/Member';
import { body } from 'express-validator';

export const createMember = async (req: Request, res: Response) => {
    const { nomeCompleto, dataNascimento, emailInstitucional, cargo, telefone, genero, dataIngresso, habilidades } = req.body;
    const foto = req.file?.path;

    try {
        // Validações adicionais
        if (!emailInstitucional.endsWith('@compjunior.com.br')) { // Atualizado para o domínio correto
            return res.status(400).json({ message: 'O email deve pertencer ao domínio compjunior.com.br' });
        }

        if (new Date(dataNascimento) >= new Date()) {
            return res.status(400).json({ message: 'A data de nascimento deve ser anterior à data atual' });
        }

        if (new Date(dataIngresso) >= new Date()) {
            return res.status(400).json({ message: 'A data de ingresso deve ser anterior à data atual' });
        }

        const memberRepository = AppDataSource.getRepository(Member);

        const newMember = memberRepository.create({
            nomeCompleto,
            email: emailInstitucional,
            password: '', // Define a default or hashed password if necessary
            role: cargo,
            isActive: true, // Default to active, adjust as needed
            skills: habilidades,
            gender: genero,
            phone: telefone,
            photo: foto,
        });

        await memberRepository.save(newMember);
        const members = await memberRepository.find(); // Listar todos os membros após criação
        res.status(201).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar membro', error });
    }
};

export const getMembers = async (req: Request, res: Response) => {
    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const members = await memberRepository.find();
        res.json(members);
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
    const { nomeCompleto, dataNascimento, emailInstitucional, cargo, telefone, genero, dataIngresso, habilidades } = req.body;
    const foto = req.file?.path;

    try {
        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOne({ where: { id: parseInt(id) } });

        if (!member) return res.status(404).json({ message: 'Membro não encontrado' });

        Object.assign(member, { nomeCompleto, dataNascimento, emailInstitucional, cargo, telefone, genero, foto, dataIngresso, habilidades });
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

        // Confirmação antes de excluir
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