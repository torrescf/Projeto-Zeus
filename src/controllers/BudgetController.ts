import { Request, Response } from 'express';
import { AppDataSource } from "../database/data-source";
import { Project } from '../database/entities/Project';
import { Client } from '../database/entities/Client';

// Cria um novo projeto
export const createBudget = async (req: Request, res: Response) => {
    const { name, description, clientId } = req.body;
    try {
        if (!name || !description || !clientId) {
            return res.status(400).json({ message: 'name, description e clientId são obrigatórios' });
        }
        const projectRepository = AppDataSource.getRepository(Project);
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({ where: { id: Number(clientId) } });
        if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });
        const project = projectRepository.create({
            name,
            description,
            client,
            created_at: new Date(),
        });
        await projectRepository.save(project);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar projeto', error });
    }
};

export const createBudgetByClientId = createBudget;

// Lista todos os projetos
export const getBudgets = async (req: Request, res: Response) => {
    try {
        const projectRepository = AppDataSource.getRepository(Project);
        const projects = await projectRepository.find({ relations: ["client"] });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projetos', error });
    }
};

// Busca projeto por ID
export const getBudgetById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const projectRepository = AppDataSource.getRepository(Project);
        const project = await projectRepository.findOne({ where: { id: parseInt(id) }, relations: ["client"] });
        if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projeto', error });
    }
};

// Atualiza projeto
export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, clientId } = req.body;
    try {
        const projectRepository = AppDataSource.getRepository(Project);
        const clientRepository = AppDataSource.getRepository(Client);
        const project = await projectRepository.findOne({ where: { id: parseInt(id) } });
        if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });
        if (name) project.name = name;
        if (description) project.description = description;
        if (clientId) {
            const client = await clientRepository.findOne({ where: { id: Number(clientId) } });
            if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });
            project.client = client;
        }
        await projectRepository.save(project);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar projeto', error });
    }
};

// Deleta projeto
export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const confirm = req.query.confirm;
    if (confirm !== "true") {
        return res.status(400).json({ message: "Confirmação obrigatória para exclusão" });
    }
    try {
        const projectRepository = AppDataSource.getRepository(Project);
        const result = await projectRepository.delete(id);
        if (result.affected === 0) return res.status(404).json({ message: 'Projeto não encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir projeto', error });
    }
};