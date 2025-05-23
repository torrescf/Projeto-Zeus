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
import { AppDataSource } from "../database/data-source";
import { Member } from "../database/entities/Member";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_forte_aqui') as { id: number };
        const memberRepository = AppDataSource.getRepository(Member);
        
        const member = await memberRepository.findOne({ where: { id: decoded.id.toString() } });
        if (!member) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Adiciona o usuário à requisição para uso posterior
        req.userId = member.id as any; // id é string (uuid)
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

// Middleware para permitir membros OU admins
export function isAdminOrMember(req: Request, res: Response, next: NextFunction) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'member')) {
        return next();
    }
    return res.status(403).json({ message: 'Acesso restrito a membros ou administradores.' });
}