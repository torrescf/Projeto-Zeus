import Database from "../config/data-source";

export default async () => {
    try {
        console.log("Closing test database...");
        await Database.destroy();
        console.log("Test database closed successfully");
    } catch (error) {
        console.error("Test database teardown failed:", error);
    }
};