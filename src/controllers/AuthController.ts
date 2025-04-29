// Controlador responsável por autenticação e gerenciamento de usuários.
// Inclui métodos para login, registro, recuperação e redefinição de senha.

import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { MoreThan, Column } from "typeorm";
import * as emailService from "../services/emailService";

const memberRepository = AppDataSource.getRepository(Member);

export class AuthController {
    async register(req: Request, res: Response) {
        console.log('[AUTH] Register endpoint hit - Dados recebidos:', req.body);
        
        try {
            const { name, email, password, role } = req.body;

            // Validação básica
            if (!name || !email || !password) {
                console.log('[AUTH] Falha na validação: Dados incompletos');
                return res.status(400).json({ message: "Name, email and password are required" });
            }

            // Validate email domain
            if (!email.endsWith("@compjunior.com.br")) {
                return res.status(400).json({ message: "O e-mail deve pertencer ao domínio @compjunior.com.br" });
            }

            // Verifica se o usuário já existe
            console.log('[AUTH] Verificando se usuário existe...');
            const existingMember = await memberRepository.findOne({ where: { email } });
            if (existingMember) {
                console.log('[AUTH] Email já em uso:', email);
                return res.status(400).json({ message: "Email already in use" });
            }

            // Criptografa a senha
            console.log('[AUTH] Criptografando senha...');
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('[AUTH] Senha criptografada com sucesso');

            // Cria o novo membro
            console.log('[AUTH] Criando novo usuário...');
            const newMember = memberRepository.create({
                name,
                email,
                password: hashedPassword,
                role: role || "member",
                isActive: true
            });

            await memberRepository.save(newMember);
            console.log('[AUTH] Usuário criado com ID:', newMember.id);

            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = newMember;

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
        console.log('[AUTH] Login endpoint hit - Dados recebidos:', req.body);
        
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                console.log('[AUTH] Falha na validação: Email ou senha faltando');
                return res.status(400).json({ message: "Email and password are required" });
            }

            // Encontra o usuário
            console.log('[AUTH] Buscando usuário:', email);
            const member = await memberRepository.findOne({ 
                where: { email },
                select: ['id', 'name', 'email', 'password', 'role', 'isActive']
            });

            if (!member) {
                console.log('[AUTH] Usuário não encontrado:', email);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Verifica a senha
            console.log('[AUTH] Verificando senha...');
            const isPasswordValid = await bcrypt.compare(password, member.password);
            if (!isPasswordValid) {
                console.log('[AUTH] Senha inválida para usuário:', email);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Gera o token JWT
            console.log('[AUTH] Gerando token JWT...');
            const token = jwt.sign(
                { 
                    id: member.id, 
                    email: member.email, 
                    role: member.role 
                },
                process.env.JWT_SECRET || "your_jwt_secret_key",
                { expiresIn: "1h" }
            );

            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = member;

            console.log('[AUTH] Login bem-sucedido para usuário:', member.id);
            return res.json({
                member: memberWithoutPassword,
                token
            });

        } catch (error) {
            console.error('[AUTH] Erro durante o login:', error);
            return res.status(500).json({ 
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        console.log('forgotPassword called with:', req.body); // Debugging log
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const member = await memberRepository.findOne({ where: { email } });
            if (!member) {
                return res.status(404).json({ message: "User not found" });
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

            member.resetPasswordToken = resetTokenHash;
            member.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await memberRepository.save(member);

            try {
                await emailService.sendPasswordResetEmail(email, resetToken);
                res.status(200).json({ message: "Email de redefinição de senha enviado" });
            } catch (emailError) {
                console.error("[AUTH] Erro ao enviar email:", emailError);
                res.status(500).json({ message: "Erro ao enviar email de redefinição de senha" });
            }
        } catch (error) {
            console.error('[AUTH] Erro durante a recuperação de senha:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async resetPassword(req: Request, res: Response) {
        console.log('resetPassword called with:', req.params, req.body); // Debugging log
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }

            const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

            const member = await memberRepository.findOne({
                where: {
                    resetPasswordToken: resetTokenHash,
                    resetPasswordExpires: MoreThan(new Date()),
                },
            });

            if (!member) {
                return res.status(400).json({ message: "Token inválido ou expirado" });
            }

            member.password = await bcrypt.hash(password, 10);
<<<<<<< Updated upstream
            member.resetPasswordToken = null as unknown as string; // Corrigido para evitar erro de tipo
            member.resetPasswordExpires = null as unknown as Date;
            await this.memberRepository.save(member);
=======
            member.resetPasswordToken = null as unknown as string;
            member.resetPasswordExpires = null as unknown as Date;
            await memberRepository.save(member);
>>>>>>> Stashed changes

            res.status(200).json({ message: "Senha redefinida com sucesso" });
        } catch (error) {
            console.error('[AUTH] Erro durante a redefinição de senha:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}