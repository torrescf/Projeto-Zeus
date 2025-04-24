"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const data_source_1 = require("../config/data-source");
const Budget_1 = require("../entities/Budget");
const Member_1 = require("../entities/Member");
const Client_1 = require("../entities/Client");
const emailService_1 = require("../services/emailService");
const budgetService_1 = require("../services/budgetService");
class BudgetController {
    budgetService = new budgetService_1.BudgetService();
    async create(req, res) {
        try {
            const { title, description, amount, clientId } = req.body;
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
            const clientRepository = data_source_1.AppDataSource.getRepository(Client_1.Client);
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
        }
        catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }
    async getAll(req, res) {
        try {
            const { status, memberId } = req.query;
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const budgets = await budgetRepository.find({
                where: {
                    ...(status && { status: status }),
                    ...(memberId && { createdBy: { id: Number(memberId) } })
                }, // Explicitly cast to avoid type errors
                relations: ["createdBy", "client"]
            });
            res.json(budgets);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getById(req, res) {
        try {
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const budget = await budgetRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ["createdBy", "client"],
            });
            if (!budget) {
                return res.status(404).json({ message: "Budget not found" });
            }
            res.json(budget);
        }
        catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }
    async update(req, res) {
        try {
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const result = await budgetRepository.update(req.params.id, req.body);
            if (result.affected === 0) {
                return res.status(404).json({ message: "Budget not found" });
            }
            res.status(200).json({ message: "Budget updated successfully" });
        }
        catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }
    async delete(req, res) {
        try {
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const result = await budgetRepository.delete(req.params.id);
            if (result.affected === 0) {
                return res.status(404).json({ message: "Budget not found" });
            }
            res.status(200).json({ message: "Budget deleted successfully" });
        }
        catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: errorMessage });
        }
    }
    async updateStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const changedBy = req.user;
        try {
            const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
            const budget = await budgetRepository.findOneBy({ id: parseInt(id) });
            if (!budget)
                return res.status(404).json({ message: "Budget not found" });
            const previousStatus = budget.status;
            await this.budgetService.updateBudget(Number(id), { status }, changedBy);
            await (0, emailService_1.sendBudgetStatusNotification)(budget, previousStatus);
            res.sendStatus(200);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).send(errorMessage);
        }
    }
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map