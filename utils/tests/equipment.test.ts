import request from "supertest";
import { app } from "../../src/app/index";
import { AppDataSource } from "../../src/database/data-source";

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

describe("Equipment Endpoints", () => {
    it("should create equipment", async () => {
        const response = await request(app)
            .post("/equipment")
            .send({ name: "Laptop", description: "Dell XPS 13" });
        expect(response.status).toBe(201);
    });

    it("should get all equipment", async () => {
        const response = await request(app).get("/equipment");
        expect(response.status).toBe(200);
    });

    it("should get equipment by ID", async () => {
        const response = await request(app).get("/equipment/1");
        expect(response.status).toBe(200);
    });

    it("should update equipment", async () => {
        const response = await request(app).put("/equipment/1").send({ name: "Updated Laptop" });
        expect(response.status).toBe(204);
    });

    it("should delete equipment", async () => {
        const response = await request(app).delete("/equipment/1");
        expect(response.status).toBe(204);
    });
});

describe("Equipment Check-in/Check-out Flow", () => {
    it("should check out equipment to a member", async () => {
        const response = await request(app)
            .put("/equipment/1/check-out")
            .send({ memberId: 1 });
        expect(response.status).toBe(200);
        expect(response.body.checkedOutBy).toBeDefined();
    });

    it("should check in equipment", async () => {
        const response = await request(app)
            .put("/equipment/1/check-in");
        expect(response.status).toBe(200);
        expect(response.body.checkedOutBy).toBeNull();
    });
});
