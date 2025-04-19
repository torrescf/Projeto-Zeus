import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "zeus_admin",
    password: process.env.DB_PASSWORD || "zeus_password",
    database: process.env.DB_NAME || "zeus_db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    entities: [
        "src/entities/*.ts"
    ],
    migrations: [
        "src/migrations/*.ts"
    ],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err: unknown) => {
        console.error("Error during Data Source initialization", err);
    });