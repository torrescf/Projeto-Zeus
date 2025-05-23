// Controlador responsável por autenticação e gerenciamento de usuários.
// Inclui métodos para login, registro, recuperação e redefinição de senha.

import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Member } from "../database/entities/Member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { addHours } from "date-fns";
import { sendPasswordResetEmail } from "../services/Email/nodemailer";

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
    max: 2, // Máximo de 3 e-mails por minuto
    message: { message: 'Muitas solicitações de envio de e-mail. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export class AuthController {
    async register(req: Request, res: Response) {
        // Se for registro de cliente, oriente a usar a rota correta
        if (req.body.name) {
            return res.status(400).json({ message: "Para registrar clientes, use /auth/register-client com name, email e password." });
        }

        console.log('[AUTH] Register endpoint hit - Dados recebidos:', req.body);
        try {
            // Corrija: use "nomeCompleto" apenas se existir na entidade
            const { nomeCompleto, email, password, role, phone, gender, skills, name } = req.body;
            let memberData: any = {
                email,
                password: await bcrypt.hash(password, 10),
                role: role || "member",
                isActive: true,
                phone,
                gender,
                skills: Array.isArray(skills) ? skills : (typeof skills === "string" ? skills.split(",") : []),
                nomeCompleto: nomeCompleto || name
            };
            if (!memberData.nomeCompleto || !email || !password) {
                return res.status(400).json({ message: "nomeCompleto, email e password são obrigatórios" });
            }
            const memberRepository = AppDataSource.getRepository(Member);
            const existingMember = await memberRepository.findOne({ where: { email } });
            if (existingMember) {
                return res.status(400).json({ message: "Email already in use" });
            }
            const newMember = memberRepository.create(memberData);
            await memberRepository.save(newMember);
            // Remover password do retorno (Member é objeto, não array)
            const memberWithoutPassword = { ...newMember } as any;
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

            // Primeiro tenta autenticar como membro
            const memberRepository = AppDataSource.getRepository(Member);
            const member = await memberRepository.findOne({ where: { email }, select: ['id', 'password', 'role'] });
            if (member && await bcrypt.compare(password, member.password)) {
                const token = jwt.sign(
                    { id: member.id, role: member.role },
                    process.env.JWT_SECRET || 'sua_chave_secreta_forte_aqui',
                    { expiresIn: '1h' }
                );
                const refreshToken = jwt.sign(
                    { id: member.id },
                    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
                    { expiresIn: '7d' }
                );
                return res.json({ token, refreshToken, type: 'member' });
            }

            // Se não for membro, tenta autenticar como cliente
            const clientRepository = AppDataSource.getRepository(require('../database/entities/Client').Client);
            const client = await clientRepository.findOne({ where: { email } });
            if (client && await bcrypt.compare(password, client.password)) {
                const token = jwt.sign(
                    { id: client.id, type: 'client' },
                    process.env.JWT_SECRET || 'sua_chave_secreta_forte_aqui',
                    { expiresIn: '1h' }
                );
                const refreshToken = jwt.sign(
                    { id: client.id, type: 'client' },
                    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
                    { expiresIn: '7d' }
                );
                return res.json({ token, refreshToken, type: 'client' });
            }

            return res.status(401).json({ message: 'Credenciais inválidas' });
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
            member.resetPasswordToken = token;
            member.resetPasswordExpires = addHours(new Date(), 1); // Expira em 1 hora
            await memberRepository.save(member);

            await sendPasswordResetEmail(email, token);

            res.json({ message: 'E-mail de redefinição enviado' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao enviar e-mail', error });
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { token, password } = req.body;

        try {
            const memberRepository = AppDataSource.getRepository(Member);
            const member = await memberRepository.findOne({ where: { resetPasswordToken: token } });

            if (!member) {
                return res.status(400).json({ message: 'Token inválido ou expirado' });
            }

            member.password = await bcrypt.hash(password, 10);
            member.resetPasswordToken = ""; // Corrija: use string vazia para resetPasswordToken
            await memberRepository.save(member);

            res.json({ message: 'Senha redefinida com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao redefinir senha', error });
        }
    }
}

// Exportando os limitadores para uso nas rotas
export { loginLimiter, emailLimiter };