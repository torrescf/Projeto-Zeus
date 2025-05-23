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
router.post("/forgot-password-client", async (req, res) => {
  const { email } = req.body;
  try {
    const clientRepository = require("../../database/data-source").AppDataSource.getRepository(require("../../database/entities/Client").Client);
    const client = await clientRepository.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    const token = require("crypto").randomBytes(20).toString("hex");
    client.resetPasswordToken = token;
    client.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await clientRepository.save(client);
    await require("../../services/Email/nodemailer").sendPasswordResetEmail(email, token);
    res.json({ message: "E-mail de redefinição enviado para o cliente" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail para cliente", error });
  }
});

router.post("/reset-password-client/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const clientRepository = require("../../database/data-source").AppDataSource.getRepository(require("../../database/entities/Client").Client);
    const client = await clientRepository.findOne({ where: { resetPasswordToken: token } });
    if (!client) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }
    client.password = await require("bcryptjs").hash(password, 10);
    client.resetPasswordToken = null;
    client.resetPasswordExpires = null;
    await clientRepository.save(client);
    res.json({ message: "Senha redefinida com sucesso para o cliente" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao redefinir senha do cliente", error });
  }
});

export default router;
