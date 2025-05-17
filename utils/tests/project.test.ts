import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let projectId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Project Endpoints", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("project").createQueryBuilder().delete().execute();
        const response = await request(app)
            .post("/project")
            .send({ name: "Test Project", description: "Project Description", status: "planning" });
        projectId = response.body.id;
    });

    it("should create a project", async () => {
        expect(projectId).toBeDefined();
    });

    it("should get all projects", async () => {
        const response = await request(app).get("/project");
        expect(response.status).toBe(200);
    });

    it("should get a project by ID", async () => {
        const response = await request(app).get(`/project/${projectId}`);
        expect(response.status).toBe(200);
    });

    it("should update a project", async () => {
        const response = await request(app).put(`/project/${projectId}`).send({ name: "Updated Project" });
        expect(response.status).toBe(204);
    });

    it("should delete a project", async () => {
        const response = await request(app).delete(`/project/${projectId}`);
        expect(response.status).toBe(204);
    });
});
