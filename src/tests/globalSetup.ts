import { AppDataSource } from "../config/data-source";

export default async () => {
    await AppDataSource.initialize();
};