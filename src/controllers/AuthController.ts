// Controlador responsável por autenticação e gerenciamento de usuários.
// Inclui métodos para login, registro, recuperação e redefinição de senha.

import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Member } from "../database/entities/Member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { addHours } from "date-fns";

// Limitação de tentativas de login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 tentativas
    message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Adicionando limitador para envio de e-mails
const emailLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 3, // Máximo de 3 e-mails por minuto
    message: { message: 'Muitas solicitações de envio de e-mail. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export class AuthController {
    async register(req: Request, res: Response) {
        console.log('[AUTH] Register endpoint hit - Dados recebidos:', req.body);
        try {
            const { nomeCompleto, email, password, role, phone, gender, skills } = req.body;
            if (!nomeCompleto || !email || !password) {
                console.log('[AUTH] Falha na validação: Dados incompletos');
                return res.status(400).json({ message: "nomeCompleto, email e password são obrigatórios" });
            }
            const memberRepository = AppDataSource.getRepository(Member);
            const existingMember = await memberRepository.findOne({ where: { email } });
            if (existingMember) {
                console.log('[AUTH] Email já em uso:', email);
                return res.status(400).json({ message: "Email already in use" });
            }
            console.log('[AUTH] Criptografando senha...');
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('[AUTH] Senha criptografada com sucesso');
            const newMember = memberRepository.create({
                nomeCompleto,
                email,
                password: hashedPassword,
                role: role || "member",
                isActive: true,
                phone,
                gender,
                skills
            });
            await memberRepository.save(newMember);
            console.log('[AUTH] Usuário criado com ID:', newMember.id);
            const memberWithoutPassword: Omit<Member, 'password'> & { password?: string } = { ...newMember };
            delete memberWithoutPassword.password;
            return res.status(201).json(memberWithoutPassword);
        } catch (error) {
            console.error('[AUTH] Erro durante o registro:', error);
            return res.status(500).json({ 
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            // Validação de entrada
            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            const memberRepository = AppDataSource.getRepository(Member);
            const member = await memberRepository.findOne({ where: { email }, select: ['id', 'password', 'role'] });

            if (!member || !(await bcrypt.compare(password, member.password))) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: member.id, role: member.role },
                process.env.JWT_SECRET || 'sua_chave_secreta_forte_aqui',
                { expiresIn: '1h' } // Expiração de 1 hora
            );

            // Adicionar refreshToken opcional
            const refreshToken = jwt.sign(
                { id: member.id },
                process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
                { expiresIn: '7d' } // Expiração de 7 dias
            );

            res.json({ token, refreshToken });
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const memberRepository = AppDataSource.getRepository(Member);
            const member = await memberRepository.findOne({ where: { email } });

            if (!member) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            member.resetToken = token;
            member.resetPasswordExpires = addHours(new Date(), 1); // Expira em 1 hora
            await memberRepository.save(member);

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });

            await transporter.sendMail({
                to: email,
                subject: 'Redefinição de Senha',
                html: `<a href="${process.env.APP_URL}/reset-password?token=${token}">Clique aqui para redefinir sua senha</a>`
            });

            res.json({ message: 'E-mail de redefinição enviado' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao enviar e-mail', error });
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { token, password } = req.body;

        try {
            const memberRepository = AppDataSource.getRepository(Member);
            const member = await memberRepository.findOne({ where: { resetToken: token } });

            if (!member) {
                return res.status(400).json({ message: 'Token inválido ou expirado' });
            }

            member.password = await bcrypt.hash(password, 10);
            member.resetToken = undefined;
            await memberRepository.save(member);

            res.json({ message: 'Senha redefinida com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao redefinir senha', error });
        }
    }
}

// Exportando os limitadores para uso nas rotas
export { loginLimiter, emailLimiter };