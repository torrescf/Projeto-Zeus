import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Client } from "../database/entities/Client";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import { uploadPhoto } from '../middlewares/uploadMiddleware';

cloudinary.config({
  cloud_name: 'dqalvfs9e',
  api_key: '481816896419698',
  api_secret: 'RZY2bnvKSU2puaSLMo32GqO0nRU',
});

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
        const clients = await clientRepository.find({ relations: ["projects"] });
        res.json(clients);
    }

    async getById(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["projects"],
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

    async uploadProfilePhoto(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
        }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'clients',
                public_id: `client_${req.params.id}`,
                overwrite: true
            });
            // Atualiza o client com a URL da foto
            const clientRepository = AppDataSource.getRepository(Client);
            await clientRepository.update(req.params.id, { photoUrl: result.secure_url });
            res.json({ url: result.secure_url });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao enviar imagem para o Cloudinary', error });
        }
    }
}
