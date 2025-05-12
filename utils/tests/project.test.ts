import request from "supertest";
import { app } from "../../src/app/index";

describe("Project Endpoints", () => {
    it("should create a project", async () => {
        const response = await request(app)
            .post("/project")
            .send({ name: "Test Project", description: "Project Description", status: "planning" });
        expect(response.status).toBe(201);
    });

    it("should get all projects", async () => {
        const response = await request(app).get("/project");
        expect(response.status).toBe(200);
    });

    it("should get a project by ID", async () => {
        const response = await request(app).get("/project/1");
        expect(response.status).toBe(200);
    });

    it("should update a project", async () => {
        const response = await request(app).put("/project/1").send({ name: "Updated Project" });
        expect(response.status).toBe(204);
    });

    it("should delete a project", async () => {
        const response = await request(app).delete("/project/1");
        expect(response.status).toBe(204);
    });
});
