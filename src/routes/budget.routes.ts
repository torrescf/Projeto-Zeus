import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const budgetController = new BudgetController();

router.post("/", authMiddleware, budgetController.create);
router.get("/", authMiddleware, budgetController.getAll);
router.get("/:id", authMiddleware, budgetController.getById);
router.put("/:id", authMiddleware, budgetController.update);
router.delete("/:id", authMiddleware, budgetController.delete);

export default router;