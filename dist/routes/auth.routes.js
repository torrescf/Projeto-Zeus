"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post("/register", authController.register);
router.post("/login", rateLimit_1.loginLimiter, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map