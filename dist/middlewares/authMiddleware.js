"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../config/data-source");
const Member_1 = require("../entities/Member");
async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
        const memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
        const member = await memberRepository.findOne({ where: { id: decoded.id } });
        if (!member) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Adiciona o usuário à requisição para uso posterior
        req.userId = member.id;
        req.user = member;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=authMiddleware.js.map