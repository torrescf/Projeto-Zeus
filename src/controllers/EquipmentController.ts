import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Equipment } from "../entities/Equipment";
import { Member } from "../entities/Member";

export class EquipmentController {
    private equipmentRepository = AppDataSource.getRepository(Equipment);
    private memberRepository = AppDataSource.getRepository(Member);

    async create(req: Request, res: Response) {
        const equipment = this.equipmentRepository.create(req.body);
        await this.equipmentRepository.save(equipment);
        res.status(201).json(equipment);
    }

    async getAll(req: Request, res: Response) {
        const equipment = await this.equipmentRepository.find({ relations: ["checkedOutBy"] });
        res.json(equipment);
    }

    async getById(req: Request, res: Response) {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["checkedOutBy"],
        });
        equipment ? res.json(equipment) : res.status(404).json({ message: "Equipment not found" });
    }

    async checkOut(req: Request, res: Response) {
        const { memberId } = req.body;
        const equipment = await this.equipmentRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["checkedOutBy"],
        });
        const member = await this.memberRepository.findOneBy({ id: memberId });

        if (!equipment || !member) return res.status(404).json({ message: "Equipment or Member not found" });

        equipment.checkedOutBy = member;
        await this.equipmentRepository.save(equipment);
        res.status(200).json(equipment);
    }

    async checkIn(req: Request, res: Response) {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["checkedOutBy"],
        });
        if (!equipment) return res.status(404).json({ message: "Equipment not found" });

        equipment.checkedOutBy = null;
        await this.equipmentRepository.save(equipment);
        res.status(200).json(equipment);
    }

    async delete(req: Request, res: Response) {
        const result = await this.equipmentRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Equipment not found" });
    }
}
