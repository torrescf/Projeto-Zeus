// Middleware para autenticação e autorização de usuários.
// Verifica tokens JWT e valida permissões de administrador.

import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: Member;
            userId?: number;
        }
    }
}
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key") as { id: number };
        const memberRepository = AppDataSource.getRepository(Member);
        
        const member = await memberRepository.findOne({ where: { id: decoded.id } });
        if (!member) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Adiciona o usuário à requisição para uso posterior
        req.userId = member.id;
        req.user = member;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    next();
};