import { Router } from "express";
import { PenaltyController } from "../../controllers/PenaltyController";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new PenaltyController();

router.post("/", authMiddleware, isAdmin, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.put("/:id", authMiddleware, isAdmin, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, isAdmin, (req, res) => controller.delete(req, res));

export default router;
