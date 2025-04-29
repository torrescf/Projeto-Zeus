// Configuração da conexão com o banco de dados utilizando TypeORM.
// Inclui entidades, migrações e variáveis de ambiente.

import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Member } from "../entities/Member";
import { Project } from "../entities/Project";
import { Client } from "../entities/Client";
import { Budget } from "../entities/Budget";
import { BudgetHistory } from "../entities/BudgetHistory"; // Adicionado
import { Penalty } from "../entities/Penalty";
import { Equipment } from "../entities/Equipment";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error("Error: Missing required database environment variables.");
    process.exit(1); // Encerra o processo se as variáveis de ambiente estiverem ausentes
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "147afj",
    database: process.env.DB_NAME || "zeus_admin",
    synchronize: false, // Mantenha false quando usar migrações
    logging: true,
    entities: [Member, Project, Client, Budget, BudgetHistory, Penalty, Equipment], // Adicionado BudgetHistory
    migrations: ["src/migrations/*.ts"], // Caminho corrigido
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("[DB] Data Source inicializado com sucesso");
        } else {
            console.log("[DB] Data Source já inicializado");
        }
        return AppDataSource;
    } catch (error) {
        console.error("[DB] Error initializing Data Source:", error);
        throw error;
    }
};

export const closeDatabase = async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("[DB] Data Source encerrado com sucesso");
    }
};
