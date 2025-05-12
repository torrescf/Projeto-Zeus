import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Project } from "../database/entities/Project";
import { Member } from "../database/entities/Member";
import { Budget } from "../database/entities/Budget";

export class ProjectController {
    private projectRepository = AppDataSource.getRepository(Project);
    private memberRepository = AppDataSource.getRepository(Member);
    private budgetRepository = AppDataSource.getRepository(Budget);

    async create(req: Request, res: Response) {
        const { leaderId, budgetId, ...projectData } = req.body;
        const leader = await this.memberRepository.findOneBy({ id: leaderId });
        const budget = await this.budgetRepository.findOneBy({ id: budgetId });

        if (!leader || !budget) return res.status(404).json({ message: "Leader or Budget not found" });

        const project = this.projectRepository.create({ ...projectData, leader, budget });
        await this.projectRepository.save(project);
        res.status(201).json(project);
    }

    async getAll(req: Request, res: Response) {
        const projects = await this.projectRepository.find({ relations: ["leader", "budget"] });
        res.json(projects);
    }

    async getById(req: Request, res: Response) {
        const project = await this.projectRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["leader", "budget"],
        });
        project ? res.json(project) : res.status(404).json({ message: "Project not found" });
    }

    async update(req: Request, res: Response) {
        const result = await this.projectRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Project not found" });
    }

    async delete(req: Request, res: Response) {
        const result = await this.projectRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Project not found" });
    }
}
