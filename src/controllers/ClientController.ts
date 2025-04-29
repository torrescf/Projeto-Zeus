import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";

const clientRepository = AppDataSource.getRepository(Client);

export class ClientController {
    async create(req: Request, res: Response) {
        try {
            const client = clientRepository.create(req.body);
            await clientRepository.save(client);
            res.status(201).json(client);
        } catch (error) {
            console.error('[CLIENT] Error creating client:', error);
            res.status(500).json({ message: 'Error creating client' });
        }
    }

    async getAll(req: Request, res: Response) {
        const clients = await clientRepository.find({ relations: ["projects", "budgets"] });
        res.json(clients);
    }

    async getById(req: Request, res: Response) {
        try {
            const client = await clientRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ["budgets"], // Explicitly load the budgets relation
            });

            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }

            res.status(200).json(client);
        } catch (error) {
            console.error("Error fetching client:", error);
            res.status(500).json({ message: "Error fetching client" });
        }
    }

    async update(req: Request, res: Response) {
        const result = await clientRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }

    async delete(req: Request, res: Response) {
        const result = await clientRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }
}
