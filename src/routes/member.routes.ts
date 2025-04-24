import { Router } from "express";
import { MemberController } from "../controllers/MemberController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import { uploadPhoto } from "../middlewares/uploadMiddleware";

const router = Router();
const controller = new MemberController();

router.post("/", authMiddleware, isAdmin, uploadPhoto, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.delete);

export default router;