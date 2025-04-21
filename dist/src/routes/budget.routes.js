"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const budgetController = new BudgetController_1.BudgetController();
router.post("/", authMiddleware_1.authMiddleware, budgetController.create);
router.get("/", authMiddleware_1.authMiddleware, budgetController.getAll);
router.get("/:id", authMiddleware_1.authMiddleware, budgetController.getById);
router.put("/:id", authMiddleware_1.authMiddleware, budgetController.update);
router.delete("/:id", authMiddleware_1.authMiddleware, budgetController.delete);
exports.default = router;
//# sourceMappingURL=budget.routes.js.map