"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../config/data-source");
const Member_1 = require("../entities/Member");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const typeorm_1 = require("typeorm");
class AuthController {
    memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
    async register(req, res) {
        console.log('[AUTH] Register endpoint hit - Dados recebidos:', req.body);
        try {
            const { name, email, password, role } = req.body;
            // Validação básica
            if (!name || !email || !password) {
                console.log('[AUTH] Falha na validação: Dados incompletos');
                return res.status(400).json({ message: "Name, email and password are required" });
            }
            // Verifica se o usuário já existe
            console.log('[AUTH] Verificando se usuário existe...');
            const existingMember = await this.memberRepository.findOne({ where: { email } });
            if (existingMember) {
                console.log('[AUTH] Email já em uso:', email);
                return res.status(400).json({ message: "Email already in use" });
            }
            // Criptografa a senha
            console.log('[AUTH] Criptografando senha...');
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            console.log('[AUTH] Senha criptografada com sucesso');
            // Cria o novo membro
            console.log('[AUTH] Criando novo usuário...');
            const newMember = this.memberRepository.create({
                name,
                email,
                password: hashedPassword,
                role: role || "member",
                isActive: true
            });
            await this.memberRepository.save(newMember);
            console.log('[AUTH] Usuário criado com ID:', newMember.id);
            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = newMember;
            return res.status(201).json(memberWithoutPassword);
        }
        catch (error) {
            console.error('[AUTH] Erro durante o registro:', error);
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async login(req, res) {
        console.log('[AUTH] Login endpoint hit - Dados recebidos:', req.body);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.log('[AUTH] Falha na validação: Email ou senha faltando');
                return res.status(400).json({ message: "Email and password are required" });
            }
            // Encontra o usuário
            console.log('[AUTH] Buscando usuário:', email);
            const member = await this.memberRepository.findOne({
                where: { email },
                select: ['id', 'name', 'email', 'password', 'role', 'isActive']
            });
            if (!member) {
                console.log('[AUTH] Usuário não encontrado:', email);
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Verifica a senha
            console.log('[AUTH] Verificando senha...');
            const isPasswordValid = await bcryptjs_1.default.compare(password, member.password);
            if (!isPasswordValid) {
                console.log('[AUTH] Senha inválida para usuário:', email);
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Gera o token JWT
            console.log('[AUTH] Gerando token JWT...');
            const token = jsonwebtoken_1.default.sign({
                id: member.id,
                email: member.email,
                role: member.role
            }, process.env.JWT_SECRET || "your_jwt_secret_key", { expiresIn: "1h" });
            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = member;
            console.log('[AUTH] Login bem-sucedido para usuário:', member.id);
            return res.json({
                member: memberWithoutPassword,
                token
            });
        }
        catch (error) {
            console.error('[AUTH] Erro durante o login:', error);
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const member = await this.memberRepository.findOne({ where: { email } });
            if (!member) {
                return res.status(404).json({ message: "User not found" });
            }
            // Generate a reset token
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const resetTokenHash = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
            // Save the hashed token and expiration in the database
            member.resetPasswordToken = resetTokenHash;
            member.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await this.memberRepository.save(member);
            // Send email with the reset token
            const transporter = nodemailer_1.default.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const resetUrl = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`;
            const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
            await transporter.sendMail({
                to: email,
                subject: "Password Reset Request",
                text: message,
            });
            res.status(200).json({ message: "Password reset email sent" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }
            const resetTokenHash = crypto_1.default.createHash("sha256").update(token).digest("hex");
            const member = await this.memberRepository.findOne({
                where: {
                    resetPasswordToken: resetTokenHash,
                    resetPasswordExpires: (0, typeorm_1.MoreThan)(new Date()),
                },
            });
            if (!member) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }
            // Update the password
            member.password = await bcryptjs_1.default.hash(password, 10);
            member.resetPasswordToken = null; // Corrigido para evitar erro de tipo
            member.resetPasswordExpires = null;
            await this.memberRepository.save(member);
            res.status(200).json({ message: "Password reset successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map