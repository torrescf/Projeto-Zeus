import Database from "../config/data-source";

export default async () => {
    try {
        console.log("Initializing test database...");
        await Database.getInstance();
        console.log("Test database initialized successfully");
    } catch (error) {
        console.error("Test database initialization failed:", error);
        throw error;
    }
};