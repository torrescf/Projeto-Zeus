import "reflect-metadata";
import express, { Application } from "express";
import { AppDataSource } from "./src/config/data-source";
import memberRoutes from "./src/routes/member.routes";
import authRoutes from "./src/routes/auth.routes";
import budgetRoutes from "./src/routes/budget.routes";

AppDataSource.initialize()
    .then(() => {
        const app: Application = express();
        app.use(express.json());

        app.use("/auth", authRoutes);
        app.use("/members", memberRoutes);
        app.use("/budgets", budgetRoutes);

        const port: number = parseInt(process.env.PORT || "3000", 10);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error: unknown) => {
        console.error("Error during Data Source initialization", error);
    });