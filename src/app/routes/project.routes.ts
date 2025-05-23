import { Router } from "express";
import { ProjectController } from "../../controllers/ProjectController";
import { authMiddleware, isAdmin, isAdminOrMember } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new ProjectController();

// Permite que qualquer usuário crie projetos (sem autenticação)
router.post("/", (req, res) => controller.create(req, res));
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
// Permite que membros e admins atualizem projetos
router.put("/:id/status", authMiddleware, isAdminOrMember, controller.updateStatus);
router.put("/:id", authMiddleware, isAdmin, controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;
