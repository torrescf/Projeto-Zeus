import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Client } from "../database/entities/Client";
import bcrypt from "bcryptjs";

export class ClientController {
    async create(req: Request, res: Response) {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email e password são obrigatórios" });
        }

        const clientRepository = AppDataSource.getRepository(Client);

        // Verifica se o email já está em uso
        const existingClient = await clientRepository.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const client = clientRepository.create({ name, email, password: hashedPassword, phone });
        await clientRepository.save(client);

        // Não retorna a senha no response
        const { password: _, ...clientWithoutPassword } = client;
        res.status(201).json(clientWithoutPassword);
    }

    async getAll(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const clients = await clientRepository.find({ relations: ["projects", "budgets"] });
        res.json(clients);
    }

    async getById(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["projects", "budgets"],
        });
        client ? res.json(client) : res.status(404).json({ message: "Client not found" });
    }

    async update(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const result = await clientRepository.update(req.params.id, req.body);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }

    async delete(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const result = await clientRepository.delete(req.params.id);
        result.affected ? res.status(204).send() : res.status(404).json({ message: "Client not found" });
    }
}
