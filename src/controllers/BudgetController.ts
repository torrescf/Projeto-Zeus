import { Request, Response } from 'express';
import { AppDataSource } from "../database/data-source";
import { Budget } from '../database/entities/Budget';
import { Member } from '../database/entities/Member';

export const createBudget = async (req: Request, res: Response) => {
    const { numeroOrcamento, descricaoProjeto, cliente, membroResponsavelId, valorEstimado, custosPrevistos } = req.body;

    try {
        // Validações adicionais
        if (!numeroOrcamento || !descricaoProjeto || !cliente || !membroResponsavelId || !valorEstimado || !custosPrevistos) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
        }

        const memberRepository = AppDataSource.getRepository(Member);
        const member = await memberRepository.findOne({ where: { id: parseInt(membroResponsavelId) } });

        if (!member) {
            return res.status(404).json({ message: 'Membro responsável não encontrado' });
        }

        const budgetRepository = AppDataSource.getRepository(Budget);

        const newBudget = budgetRepository.create({
            numeroOrcamento,
            descricaoProjeto,
            cliente,
            membroResponsavelId,
            valorEstimado,
            custosPrevistos,
            dataCriacao: new Date(),
            status: 'em_analise',
        });

        await budgetRepository.save(newBudget);
        const budgets = await budgetRepository.find(); // Listar todos os orçamentos após criação
        res.status(201).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar orçamento', error });
    }
};

export const getBudgets = async (req: Request, res: Response) => {
    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budgets = await budgetRepository.find();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamentos', error });
    }
};

export const getBudgetById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budget = await budgetRepository.findOne({ where: { id: parseInt(id) } });

        if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado' });

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamento', error });
    }
};

export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { numeroOrcamento, descricaoProjeto, cliente, membroResponsavelId, valorEstimado, custosPrevistos } = req.body;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budget = await budgetRepository.findOne({ where: { id: parseInt(id) } });

        if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado' });

        Object.assign(budget, { numeroOrcamento, descricaoProjeto, cliente, membroResponsavelId, valorEstimado, custosPrevistos });
        await budgetRepository.save(budget);

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar orçamento', error });
    }
};

export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const result = await budgetRepository.delete(id);

        if (result.affected === 0) return res.status(404).json({ message: 'Orçamento não encontrado' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir orçamento', error });
    }
};

export const changeBudgetStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budget = await budgetRepository.findOne({ where: { id: parseInt(id) } });

        if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado' });

        budget.status = status;
        await budgetRepository.save(budget);

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao alterar status do orçamento', error });
    }
};

export const getBudgetsByUser = async (req: Request, res: Response) => {
    const userId = req.userId; // Obtido do middleware de autenticação

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budgets = await budgetRepository.find({ where: { membroResponsavelId: userId } });

        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamentos do usuário', error });
    }
};