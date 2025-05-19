import express from 'express';
import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, createBudgetByClientId } from '../../controllers/BudgetController';
import { check } from 'express-validator';

const router = express.Router();

// Nova rota para criar orçamento usando clienteId (deve vir antes das rotas com :id)
router.post('/budgets-create', createBudgetByClientId);

// Rotas públicas para budgets
router.get('/budgets', getBudgets);
router.get('/budgets/:id', getBudgetById);

// Rotas protegidas (exemplo: criar, atualizar, deletar)
router.post(
    '/',
    [
        check('projectId').notEmpty().withMessage('O ID do projeto é obrigatório.'),
        check('amount').isNumeric().withMessage('O valor deve ser um número.'),
    ],
    createBudget
);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;