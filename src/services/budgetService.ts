import { AppDataSource } from "../config/data-source";
import { Budget } from "../entities/Budget";
import { BudgetHistory } from "../entities/BudgetHistory";
import { Member } from "../entities/Member";

async function getFilteredBudgets(filters: { status?: string, memberId?: number }) {
    const budgetRepository = AppDataSource.getRepository(Budget);
    return budgetRepository.find({
        where: {
            ...(filters.status && { status: filters.status }),
            ...(filters.memberId && { responsibleMember: { id: filters.memberId } })
        } as any, // Explicitly cast to avoid type errors
        relations: ['responsibleMember']
    });
}

export class BudgetService {
    async updateBudget(id: number, updates: Partial<Budget>, changedBy: Member) {
        const budgetRepository = AppDataSource.getRepository(Budget);
        const historyRepository = AppDataSource.getRepository(BudgetHistory);

        const budget = await budgetRepository.findOne({ where: { id }, relations: ['responsibleMember'] });
        if (!budget) throw new Error('Orçamento não encontrado');

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
            budget: updatedBudget!,
            changedBy,
        });

        return updatedBudget;
    }
}
