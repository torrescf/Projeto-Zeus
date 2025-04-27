import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";

export class ClientController {
    private clientRepository = AppDataSource.getRepository(Client);

    async create(req: Request, res: Response) {
        const client = this.clientRepository.create(req.body);
        await this.clientRepository.save(client);
        res.status(201).json(client);
    }

    async getAll(req: Request, res: Response) {
        const clients = await this.clientRepository.find({ relations: ["projects", "budgets"] });
        res.json(clients);
    }

    async getById(req: Request, res: Response) {
        const client = await this.clientRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["projects", "budgets"],
        });
        client ? res.json(client) : res.status(404).json({ message: "Client not found" });
    }

    async update(req: Request, res: Response) {
        const result = await this.clientRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }

    async delete(req: Request, res: Response) {
        const result = await this.clientRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }
}
