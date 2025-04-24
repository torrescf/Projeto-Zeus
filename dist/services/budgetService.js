"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const data_source_1 = require("../config/data-source");
const Budget_1 = require("../entities/Budget");
const BudgetHistory_1 = require("../entities/BudgetHistory");
async function getFilteredBudgets(filters) {
    const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
    return budgetRepository.find({
        where: {
            ...(filters.status && { status: filters.status }),
            ...(filters.memberId && { responsibleMember: { id: filters.memberId } })
        }, // Explicitly cast to avoid type errors
        relations: ['responsibleMember']
    });
}
class BudgetService {
    async updateBudget(id, updates, changedBy) {
        const budgetRepository = data_source_1.AppDataSource.getRepository(Budget_1.Budget);
        const historyRepository = data_source_1.AppDataSource.getRepository(BudgetHistory_1.BudgetHistory);
        const budget = await budgetRepository.findOne({ where: { id }, relations: ['responsibleMember'] });
        if (!budget)
            throw new Error('Orçamento não encontrado');
        const previousData = {
            status: budget.status,
            amount: budget.amount,
            // ...other relevant fields...
        };
        await budgetRepository.update(id, updates);
        const updatedBudget = await budgetRepository.findOneBy({ id });
        await historyRepository.save({
            action: 'UPDATE',
            previousData,
            newData: updates,
            budget: updatedBudget,
            changedBy,
        });
        return updatedBudget;
    }
}
exports.BudgetService = BudgetService;
//# sourceMappingURL=budgetService.js.map