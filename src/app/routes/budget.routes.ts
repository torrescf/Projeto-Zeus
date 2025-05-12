import express from 'express';
import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, changeBudgetStatus } from '../../controllers/BudgetController';
import { isAdmin } from '../../middlewares/authMiddleware';
import { check } from 'express-validator';

const router = express.Router();

// CRUD de orçamentos
router.post(
    '/',
    isAdmin,
    [
        check('numeroOrcamento').notEmpty().withMessage('O número do orçamento é obrigatório.'),
        check('descricaoProjeto').notEmpty().withMessage('A descrição do projeto é obrigatória.'),
        check('cliente').notEmpty().withMessage('O cliente é obrigatório.'),
        check('membroResponsavelId').notEmpty().withMessage('O ID do membro responsável é obrigatório.'),
        check('valorEstimado').isNumeric().withMessage('O valor estimado deve ser um número.'),
        check('custosPrevistos').notEmpty().withMessage('Os custos previstos são obrigatórios.'),
    ],
    createBudget
);
router.get('/', isAdmin, getBudgets);
router.get('/:id', isAdmin, getBudgetById);
router.put('/:id', isAdmin, updateBudget);
router.delete('/:id', isAdmin, deleteBudget);

// Alterar status do orçamento
router.put('/:id/status', isAdmin, changeBudgetStatus);

export default router;