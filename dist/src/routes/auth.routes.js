"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post("/register", authController.register);
router.post("/login", authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map