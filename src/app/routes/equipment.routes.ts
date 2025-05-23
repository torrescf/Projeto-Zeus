import { Router } from "express";
import { EquipmentController } from "../../controllers/EquipmentController";
import { authMiddleware, isAdminOrMember, isAdmin } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new EquipmentController();

router.post("/", authMiddleware, isAdminOrMember, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.put("/:id/check-out", authMiddleware, (req, res) => controller.checkOut(req, res));
router.put("/:id/check-in", authMiddleware, (req, res) => controller.checkIn(req, res));
router.put("/:id", authMiddleware, isAdminOrMember, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, isAdmin, (req, res) => controller.delete(req, res));

export default router;
