import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error("Error: Missing required database environment variables.");
    process.exit(1); // Encerra o processo se as variáveis de ambiente estiverem ausentes
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "zeus_admin",
    password: process.env.DB_PASSWORD || "zeus_password",
    database: process.env.DB_NAME || "zeus_db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development" || process.env.TYPEORM_LOGGING === "true",
    entities: [
        __dirname + "/../entities/*.{ts,js}" // Suporte para arquivos .js em produção
    ],
    migrations: [
        __dirname + "/../migrations/*.{ts,js}" // Suporte para arquivos .js em produção
    ],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized successfully!");
    })
    .catch((err: unknown) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1); // Encerra o processo em caso de erro
    });
