import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";
import { createTestUser } from "./testHelpers";

describe("Equipment Controller", () => {
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

  it("should create equipment", async () => {
    const authToken = await createTestUser("admin");

    const response = await request(app)
      .post("/equipment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Equipment",
        description: "Test Description",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  describe("Check-out Flow", () => {
    it("should check out equipment to a member", async () => {
      const authToken = await createTestUser("member");
      const equipmentResponse = await request(app)
        .post("/equipment")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Equipment",
          description: "Test Description",
        });

      const equipmentId = equipmentResponse.body.id;

      const response = await request(app)
        .put(`/equipment/${equipmentId}/check-out`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ memberId: equipmentResponse.body.id });

      expect(response.status).toBe(200);
      expect(response.body.checkedOutBy.id).toBe(equipmentResponse.body.id);
    });

    it("should check in equipment", async () => {
      const authToken = await createTestUser("member");
      const equipmentResponse = await request(app)
        .post("/equipment")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Equipment",
          description: "Test Description",
        });

      const equipmentId = equipmentResponse.body.id;

      // Primeiro faz check-out
      await request(app)
        .put(`/equipment/${equipmentId}/check-out`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ memberId: equipmentResponse.body.id });

      // Depois faz check-in
      const response = await request(app)
        .put(`/equipment/${equipmentId}/check-in`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.checkedOutBy).toBeNull();
    });
  });
});