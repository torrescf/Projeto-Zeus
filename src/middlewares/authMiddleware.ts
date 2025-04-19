import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source"; 
import { Member } from "../entities/Member";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const member = await AppDataSource.getRepository(Member).findOne({ where: { id: decoded.id } });
        
        if (!member) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        (req as any).member = member; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};