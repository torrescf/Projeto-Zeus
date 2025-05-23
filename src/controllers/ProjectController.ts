import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Project } from "../database/entities/Project";
import { Client } from "../database/entities/Client";

export class ProjectController {
    private projectRepository = AppDataSource.getRepository(Project);
    private clientRepository = AppDataSource.getRepository(Client);

    async create(req: Request, res: Response) {
        const { name, description, clientId, amount } = req.body;
        if (!name || !description || !clientId) {
            return res.status(400).json({ message: "name, description e clientId são obrigatórios" });
        }
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (!client) return res.status(404).json({ message: "Cliente não encontrado" });
        const project = this.projectRepository.create({ name, description, client, amount, status: 'em analise' });
        await this.projectRepository.save(project);
        const { password, ...clientWithoutPassword } = client;
        const projectResponse = { ...project, client: clientWithoutPassword };
        res.status(201).json(projectResponse);
    }

    async getAll(req: Request, res: Response) {
        const projects = await this.projectRepository.find({ relations: ["client"] });
        const projectsWithoutPassword = projects.map(project => {
            if (project.client) {
                const { password, ...clientWithoutPassword } = project.client;
                return { ...project, client: clientWithoutPassword };
            }
            return project;
        });
        res.json(projectsWithoutPassword);
    }

    async getById(req: Request, res: Response) {
        const project = await this.projectRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["client"],
        });
        if (project && project.client) {
            const { password, ...clientWithoutPassword } = project.client;
            const projectResponse = { ...project, client: clientWithoutPassword };
            res.json(projectResponse);
        } else if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    }

    async update(req: Request, res: Response) {
        const result = await this.projectRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Project not found" });
    }

    async delete(req: Request, res: Response) {
        const result = await this.projectRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Project not found" });
    }

    async updateStatus(req: Request, res: Response) {
        const { status } = req.body;
        const validStatus = ["em analise", "aprovado", "negado"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "Status inválido. Use: em analise, aprovado ou negado." });
        }
        const project = await this.projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!project) return res.status(404).json({ message: "Projeto não encontrado" });
        project.status = status;
        await this.projectRepository.save(project);
        res.json({ message: "Status atualizado com sucesso", project });
    }
}
