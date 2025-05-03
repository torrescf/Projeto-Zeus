import { DataSource } from "typeorm";
import { Member } from "../entities/Member";
import { Client } from "../entities/Client";
import { Budget } from "../entities/Budget";
import { BudgetHistory } from "../entities/BudgetHistory";
import { Equipment } from "../entities/Equipment";
import { Penalty } from "../entities/Penalty";
import { Project } from "../entities/Project";

export const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "147afj",
    database: process.env.DB_NAME || "zeus_admin",
    entities: [Member, Client, Budget, BudgetHistory, Equipment, Penalty, Project],
    synchronize: true,
    dropSchema: true,
    logging: false
});