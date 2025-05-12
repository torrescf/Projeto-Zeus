import { Router } from "express";
import { EquipmentController } from "../../controllers/EquipmentController";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new EquipmentController();

router.post("/", authMiddleware, isAdmin, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id/check-out", authMiddleware, controller.checkOut);
router.put("/:id/check-in", authMiddleware, controller.checkIn);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;
