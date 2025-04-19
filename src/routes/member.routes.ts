import { Router } from "express";
import { MemberController } from "../controllers/MemberController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new MemberController();

router.post("/members", controller.create);
router.get("/members", authMiddleware, controller.getAll);
router.get("/members/:id", authMiddleware, controller.getById);
router.put("/members/:id", authMiddleware, controller.update);
router.delete("/members/:id", authMiddleware, controller.delete);

export default router;