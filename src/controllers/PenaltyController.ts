import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Penalty } from "../database/entities/Penalty";
import { Member } from "../database/entities/Member";

export class PenaltyController {
    private penaltyRepository = AppDataSource.getRepository(Penalty);
    private memberRepository = AppDataSource.getRepository(Member);

    async create(req: Request, res: Response) {
        const { memberId, ...penaltyData } = req.body;
        const member = await this.memberRepository.findOneBy({ id: memberId });
        if (!member) return res.status(404).json({ message: "Member not found" });

        const penalty = this.penaltyRepository.create({ ...penaltyData, member });
        await this.penaltyRepository.save(penalty);
        res.status(201).json(penalty);
    }

    async getAll(req: Request, res: Response) {
        const penalties = await this.penaltyRepository.find({ relations: ["member"] });
        res.json(penalties);
    }

    async getById(req: Request, res: Response) {
        const penalty = await this.penaltyRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["member"],
        });
        penalty ? res.json(penalty) : res.status(404).json({ message: "Penalty not found" });
    }

    async update(req: Request, res: Response) {
        const result = await this.penaltyRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Penalty not found" });
    }

    async delete(req: Request, res: Response) {
        const result = await this.penaltyRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Penalty not found" });
    }
}
