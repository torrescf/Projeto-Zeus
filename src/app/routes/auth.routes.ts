// Define as rotas de autenticação, como login, registro e recuperação de senha.
// Inclui proteção contra ataques de força bruta com rate limiting.

import { Router, Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";
import { ClientController } from "../../controllers/ClientController";
import { loginLimiter } from "../../middlewares/rateLimit";

const router = Router();
const authController = new AuthController();
const clientController = new ClientController();

router.post("/register", authController.register);
router.post('/login', loginLimiter, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/register-client", clientController.create); // Nova rota para registro de clientes

export default router;
