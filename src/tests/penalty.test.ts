import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";
import { createTestUser } from "./testHelpers";

describe("Penalty Controller", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("should create a penalty", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .post("/penalty")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "Late Submission",
        reason: "Missed deadline",
        date: "2025-05-01",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all penalties", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .get("/penalty")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("should get a penalty by ID", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .get("/penalty/1")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("should update a penalty", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .put("/penalty/1")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ reason: "Updated reason" });
    expect(response.status).toBe(204);
  });

  it("should delete a penalty", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .delete("/penalty/1")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(204);
  });
});
