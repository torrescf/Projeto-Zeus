import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ProjectController();

router.post("/", authMiddleware, isAdmin, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, isAdmin, controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;
