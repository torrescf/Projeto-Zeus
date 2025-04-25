// Controlador responsável por gerenciar membros.
// Inclui métodos para criação, listagem, atualização e exclusão.

import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";

export class MemberController {
    private memberRepository = AppDataSource.getRepository(Member);

    async create(req: Request, res: Response) {
        try {
            const member = this.memberRepository.create(req.body);
            await this.memberRepository.save(member);
            res.status(201).json(member);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro desconhecido" });
            }
        }
    }

    async getAll(req: Request, res: Response) {
        const members = await this.memberRepository.find();
        res.json(members);
    }

    async getById(req: Request, res: Response) {
        try {
            const member = await this.memberRepository.findOneBy({ 
                id: parseInt(req.params.id) 
            });
            member ? res.json(member) : res.status(404).json({ message: "Membro não encontrado" });
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            await this.memberRepository.update(req.params.id, req.body);
            res.status(204).send();
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.memberRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Erro interno" });
        }
    }
}