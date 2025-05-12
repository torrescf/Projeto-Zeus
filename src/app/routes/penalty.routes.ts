import { Router } from "express";
import { PenaltyController } from "../../controllers/PenaltyController";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new PenaltyController();

router.post("/", authMiddleware, isAdmin, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, isAdmin, controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;
