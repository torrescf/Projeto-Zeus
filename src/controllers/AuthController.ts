import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
    private memberRepository = AppDataSource.getRepository(Member);

    async register(req: Request, res: Response) {
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
            const hashedPassword = await bcrypt.hash(password, 10);
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
}