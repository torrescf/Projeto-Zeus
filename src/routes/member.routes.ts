import { Router } from "express";
import { MemberController } from "../controllers/MemberController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new MemberController();

router.post("/", controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;