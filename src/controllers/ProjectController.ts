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
        const { membroResponsavelId, ...projectData } = req.body;
        const membroResponsavel = await this.memberRepository.findOneBy({ id: membroResponsavelId });

        if (!membroResponsavel) return res.status(404).json({ message: "Membro responsável não encontrado" });

        const project = this.projectRepository.create({ ...projectData, membroResponsavel });
        await this.projectRepository.save(project);
        res.status(201).json(project);
    }

    async getAll(req: Request, res: Response) {
        const projects = await this.projectRepository.find({ relations: ["membroResponsavel", "client", "membrosEquipe"] });
        res.json(projects);
    }

    async getById(req: Request, res: Response) {
        const project = await this.projectRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["membroResponsavel", "client", "membrosEquipe"],
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
