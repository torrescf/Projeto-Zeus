// Configuração da conexão com o banco de dados utilizando TypeORM.
// Inclui entidades, migrações e variáveis de ambiente.

import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { cleanEnv, str, url, port } from 'envalid';
import winston from 'winston';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
    process.env.DB_HOST = process.env.DB_HOST || 'localhost';
    process.env.DB_PORT = process.env.DB_PORT || '5432';
    process.env.DB_USER = process.env.DB_USER || 'postgres';
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || '147afj';
    process.env.DB_NAME = process.env.DB_NAME || 'zeus_admin';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
} else {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_forte_aqui';
}

// Garantir que as variáveis de ambiente sejam carregadas corretamente
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error("Variáveis de ambiente do banco de dados não estão definidas corretamente.");
}

// Adicionando logs para depuração das variáveis de ambiente
console.log("Variáveis de ambiente carregadas:", {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    NODE_ENV: process.env.NODE_ENV,
});

// Configuração do ambiente para migrações
const isMigrationContext = process.argv.some(arg => arg.includes('typeorm'));

let env;
if (!isMigrationContext) {
    env = cleanEnv(process.env, {
        FRONTEND_URL: url({ desc: 'URL do frontend', default: 'http://localhost:5173' }),
        PORT: port({ default: 4001, desc: 'Porta do servidor' }),
        DATABASE_URL: str({ desc: 'URL de conexão com o banco de dados', default: 'postgres://postgres:147afj@localhost:5432/zeus_admin' }),
        EMAIL_USER: str({ desc: 'Usuário do email', default: 'default@example.com' }),
        EMAIL_PASS: str({ desc: 'Senha do email', default: 'password' }),
        APP_URL: url({ desc: 'URL da aplicação', default: 'http://localhost:4001' }),
        JWT_SECRET: str({ desc: 'Segredo para tokens JWT', default: 'sua_chave_secreta_forte_aqui' }),
        NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development', desc: 'Ambiente de execução' }),
        DB_HOST: str({ desc: 'Host do banco de dados', default: 'localhost' }),
        DB_PORT: str({ desc: 'Porta do banco de dados', default: '5432' }),
        DB_USER: str({ desc: 'Usuário do banco de dados', default: 'postgres' }),
        DB_PASSWORD: str({ desc: 'Senha do banco de dados', default: '147afj' }),
        DB_NAME: str({ desc: 'Nome do banco de dados', default: 'zeus_admin' }),
    });
}

// Configuração do DataSource
console.log("Iniciando a configuração do AppDataSource...");

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "147afj",
    database: process.env.DB_NAME || "zeus_admin",
    synchronize: false,
    logging: true,
    entities: ["src/database/entities/*.ts"],
    migrations: ["src/database/migrations/*.ts"],
    subscribers: [],
});

// Logger existente
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});

// Testar a inicialização do AppDataSource antes de executar migrações
AppDataSource.initialize()
    .then(() => {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao inicializar o AppDataSource:", error);
        process.exit(1); // Finalizar o processo em caso de erro
    });

export { env };
