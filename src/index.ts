import "reflect-metadata";
import express, { Application } from "express";
import { AppDataSource } from "@config/data-source";
import memberRoutes from "@routes/member.routes";

AppDataSource.initialize()
    .then(() => {
        const app: Application = express();
        app.use(express.json());

        app.use("/members", memberRoutes);

        const port: number = parseInt(process.env.PORT || "3000", 10);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error: unknown) => {
        console.error("Error during Data Source initialization", error);
    });
