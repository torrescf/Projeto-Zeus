import { Request, Response } from 'express';
import { AppDataSource } from "../database/data-source";
import { Budget } from '../database/entities/Budget';
import { Project } from '../database/entities/Project';

export const createBudget = async (req: Request, res: Response) => {
    const { projectId, amount } = req.body;

    try {
        if (!projectId || !amount) {
            return res.status(400).json({ message: 'projectId e amount são obrigatórios' });
        }

        const projectRepository = AppDataSource.getRepository(Project);
        const project = await projectRepository.findOne({ where: { id: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        const budgetRepository = AppDataSource.getRepository(Budget);

        const newBudget = budgetRepository.create({
            project,
            amount,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await budgetRepository.save(newBudget);
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar orçamento', error });
    }
};

export const createBudgetByClientId = createBudget;

export const getBudgets = async (req: Request, res: Response) => {
    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budgets = await budgetRepository.find({ relations: ["project"] });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamentos', error });
    }
};

export const getBudgetById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budget = await budgetRepository.findOne({ where: { id: parseInt(id) }, relations: ["project"] });

        if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado' });

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamento', error });
    }
};

export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { projectId, amount } = req.body;

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const budget = await budgetRepository.findOne({ where: { id: parseInt(id) } });

        if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado' });

        if (projectId) {
            const projectRepository = AppDataSource.getRepository(Project);
            const project = await projectRepository.findOne({ where: { id: parseInt(projectId) } });
            if (!project) {
                return res.status(404).json({ message: 'Projeto não encontrado' });
            }
            budget.project = project;
        }
        if (amount) budget.amount = amount;
        budget.updated_at = new Date();

        await budgetRepository.save(budget);

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar orçamento', error });
    }
};

export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const confirm = req.query.confirm;

    if (confirm !== "true") {
        return res.status(400).json({ message: "Confirmação obrigatória para exclusão" });
    }

    try {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const result = await budgetRepository.delete(id);

        if (result.affected === 0) return res.status(404).json({ message: 'Orçamento não encontrado' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir orçamento', error });
    }
};