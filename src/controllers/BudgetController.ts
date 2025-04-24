import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Budget } from "../entities/Budget";
import { Member } from "../entities/Member";
import { Client } from "../entities/Client";
import { sendBudgetStatusEmail, sendBudgetStatusNotification } from "../services/emailService";
import { BudgetService } from "../services/budgetService";

export class BudgetController {
    private budgetService = new BudgetService();

    async create(req: Request, res: Response) {
        try {
            const { title, description, amount, clientId } = req.body;
            const budgetRepository = AppDataSource.getRepository(Budget);
            const memberRepository = AppDataSource.getRepository(Member);
            const clientRepository = AppDataSource.getRepository(Client);

            const member = await memberRepository.findOne({ where: { id: Number(req.userId) } });
            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            const client = await clientRepository.findOne({ where: { id: clientId } });
            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }

            const budget = budgetRepository.create({
                title,
                description,
                amount,
                status: 'pending',
                createdBy: member,
                client,
            });

            await budgetRepository.save(budget);
            res.status(201).json(budget);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { status, memberId } = req.query;
            const budgetRepository = AppDataSource.getRepository(Budget);

            const budgets = await budgetRepository.find({
                where: {
                    ...(status && { status: status as string }),
                    ...(memberId && { createdBy: { id: Number(memberId) } })
                } as any, // Explicitly cast to avoid type errors
                relations: ["createdBy", "client"]
            });

            res.json(budgets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const budgetRepository = AppDataSource.getRepository(Budget);
            const budget = await budgetRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ["createdBy", "client"],
            });

            if (!budget) {
                return res.status(404).json({ message: "Budget not found" });
            }

            res.json(budget);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const budgetRepository = AppDataSource.getRepository(Budget);
            const result = await budgetRepository.update(req.params.id, req.body);

            if (result.affected === 0) {
                return res.status(404).json({ message: "Budget not found" });
            }

            res.status(200).json({ message: "Budget updated successfully" });
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const budgetRepository = AppDataSource.getRepository(Budget);
            const result = await budgetRepository.delete(req.params.id);

            if (result.affected === 0) {
                return res.status(404).json({ message: "Budget not found" });
            }

            res.status(200).json({ message: "Budget deleted successfully" });
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        const changedBy = req.user as Member;

        try {
            const budgetRepository = AppDataSource.getRepository(Budget);
            const budget = await budgetRepository.findOneBy({ id: parseInt(id) });
            if (!budget) return res.status(404).json({ message: "Budget not found" });

            const previousStatus = budget.status;
            await this.budgetService.updateBudget(Number(id), { status }, changedBy);

            await sendBudgetStatusNotification(budget, previousStatus);
            res.sendStatus(200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).send(errorMessage);
        }
    }
}