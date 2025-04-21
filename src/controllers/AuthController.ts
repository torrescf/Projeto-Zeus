import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";
import bcrypt from "bcryptjs"; // substitua bcrypt por bcryptjs
import jwt from "jsonwebtoken";

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, role } = req.body;
            const memberRepository = AppDataSource.getRepository(Member);

            // Verifica se o usuário já existe
            const existingMember = await memberRepository.findOne({ where: { email } });
            if (existingMember) {
                return res.status(400).json({ message: "Email already in use" });
            }

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);

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
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const memberRepository = AppDataSource.getRepository(Member);

            // Encontra o usuário
            const member = await memberRepository.findOne({ where: { email } });
            if (!member) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Verifica a senha
            const isPasswordValid = await bcrypt.compare(password, member.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Gera o token JWT
            const token = jwt.sign(
                { id: member.id, email: member.email, role: member.role },
                process.env.JWT_SECRET || "your_jwt_secret_key",
                { expiresIn: "1h" }
            );

            // Remove a senha antes de retornar
            const { password: _, ...memberWithoutPassword } = member;

            res.json({
                member: memberWithoutPassword,
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}