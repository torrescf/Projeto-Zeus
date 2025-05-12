import { Router } from "express";
import { ClientController } from "../../controllers/ClientController";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new ClientController();

router.post("/", authMiddleware, isAdmin, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, isAdmin, controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;
