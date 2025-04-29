// Define as rotas de autenticação, como login, registro e recuperação de senha.
// Inclui proteção contra ataques de força bruta com rate limiting.

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

export default router;