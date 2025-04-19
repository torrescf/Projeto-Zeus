"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MemberController_1 = require("../controllers/MemberController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const controller = new MemberController_1.MemberController();
router.post("/members", controller.create);
router.get("/members", authMiddleware_1.authMiddleware, controller.getAll);
router.get("/members/:id", authMiddleware_1.authMiddleware, controller.getById);
router.put("/members/:id", authMiddleware_1.authMiddleware, controller.update);
router.delete("/members/:id", authMiddleware_1.authMiddleware, controller.delete);
exports.default = router;
//# sourceMappingURL=member.routes.js.map