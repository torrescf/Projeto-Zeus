import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Budget } from "../entities/Budget";
import { Member } from "../entities/Member";
import { Client } from "../entities/Client";

export class BudgetController {
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
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const budgetRepository = AppDataSource.getRepository(Budget);
            const budgets = await budgetRepository.find({
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
            res.status(500).json({ message: "Internal server error" });
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
            res.status(500).json({ message: "Internal server error" });
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
            res.status(500).json({ message: "Internal server error" });
        }
    }
}