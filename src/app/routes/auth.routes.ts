// Define as rotas de autenticação, como login, registro e recuperação de senha.
// Inclui proteção contra ataques de força bruta com rate limiting.

import { Router, Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";
import { loginLimiter } from "../../middlewares/rateLimit";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await someAsyncFunction(req.body);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred.");
    }
  }
});
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

export default router;

function someAsyncFunction(body: any) {
  throw new Error("Function not implemented.");
}
