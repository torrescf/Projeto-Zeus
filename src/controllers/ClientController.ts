import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Client } from "../database/entities/Client";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import { uploadPhoto } from '../middlewares/uploadMiddleware';
import { validateDateOfBirth } from '../app/utils/validateDateOfBirth';

cloudinary.config({
  cloud_name: 'dqalvfs9e',
  api_key: '481816896419698',
  api_secret: 'RZY2bnvKSU2puaSLMo32GqO0nRU',
});

export class ClientController {
    async create(req: Request, res: Response) {
        const { name, email, password, phone, data_nascimento } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email e password são obrigatórios" });
        }
        // Validação de data de nascimento
        const validationError = validateDateOfBirth(data_nascimento);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const clientRepository = AppDataSource.getRepository(Client);

        // Verifica se o email já está em uso
        const existingClient = await clientRepository.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const client = clientRepository.create({ name, email, password: hashedPassword, phone, data_nascimento: data_nascimento ? new Date(data_nascimento) : undefined });
        await clientRepository.save(client);

        // Não retorna a senha no response
        const { password: _, ...clientWithoutPassword } = client;
        // Monta objeto de resposta sem sobrescrever o tipo do entity
        const responseData: any = { ...clientWithoutPassword };
        if (responseData.data_nascimento instanceof Date) {
            responseData.data_nascimento_br = responseData.data_nascimento.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        } else if (responseData.data_nascimento) {
            // Caso venha como string ISO
            const date = new Date(responseData.data_nascimento);
            if (!isNaN(date.getTime())) {
                responseData.data_nascimento_br = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            }
        }
        res.status(201).json(responseData);
    }

    async getAll(req: Request, res: Response) {
        const clientRepository = AppDataSource.getRepository(Client);
        const clients = await clientRepository.find({ relations: ["projects"] });
        // Remove a senha e garante que photoUrl aparece mesmo se null
        const clientsWithoutPassword = clients.map(client => {
            const { password, ...rest } = client;
            return { ...rest, photoUrl: client.photoUrl ?? null };
        });
        res.json(clientsWithoutPassword);
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({
            where: { id },
            relations: ["projects"],
        });
        if (client) {
            const { password, ...clientWithoutPassword } = client;
            res.json(clientWithoutPassword);
        } else {
            res.status(404).json({ message: "Client not found" });
        }
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
