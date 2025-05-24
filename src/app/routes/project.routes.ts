import { Router } from "express";
import { ProjectController } from "../../controllers/ProjectController";
import { authMiddleware, isAdmin, isAdminOrMember } from "../../middlewares/authMiddleware";

const router = Router();
const controller = new ProjectController();

// Permite que qualquer usuário crie projetos (sem autenticação)
router.post("/", (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
// Permite que membros e admins atualizem projetos
router.put("/:id/status", authMiddleware, isAdminOrMember, controller.updateStatus);
router.put("/:id", authMiddleware, isAdminOrMember, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, isAdminOrMember, controller.delete);

export default router;
