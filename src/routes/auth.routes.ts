import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { loginLimiter } from "../middlewares/rateLimit";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

export default router;