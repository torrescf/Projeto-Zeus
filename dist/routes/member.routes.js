"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MemberController_1 = require("../controllers/MemberController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
const controller = new MemberController_1.MemberController();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, uploadMiddleware_1.uploadPhoto, controller.create);
router.get("/", authMiddleware_1.authMiddleware, controller.getAll);
router.get("/:id", authMiddleware_1.authMiddleware, controller.getById);
router.put("/:id", authMiddleware_1.authMiddleware, controller.update);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, controller.delete);
exports.default = router;
//# sourceMappingURL=member.routes.js.map