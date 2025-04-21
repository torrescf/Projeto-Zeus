"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../config/data-source");
const Member_1 = require("../entities/Member");
const bcryptjs_1 = __importDefault(require("bcryptjs")); // substitua bcrypt por bcryptjs
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
            // Verifica se o usuário já existe
            const existingMember = await memberRepository.findOne({ where: { email } });
            if (existingMember) {
                return res.status(400).json({ message: "Email already in use" });
            }
            // Criptografa a senha
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // Cria o novo membro
            const newMember = memberRepository.create({
                name,
                email,
                password: hashedPassword,
                role: role || "member",
                isActive: true
            });
            await memberRepository.save(newMember);
            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = newMember;
            res.status(201).json(memberWithoutPassword);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
            // Encontra o usuário
            const member = await memberRepository.findOne({ where: { email } });
            if (!member) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Verifica a senha
            const isPasswordValid = await bcryptjs_1.default.compare(password, member.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Gera o token JWT
            const token = jsonwebtoken_1.default.sign({ id: member.id, email: member.email, role: member.role }, process.env.JWT_SECRET || "your_jwt_secret_key", { expiresIn: "1h" });
            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = member;
            res.json({
                member: memberWithoutPassword,
                token
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map