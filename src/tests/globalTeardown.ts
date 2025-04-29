import { AppDataSource } from "../config/data-source";

export default async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
};