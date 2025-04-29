import request from "supertest";
import app from "../app";

let authToken: string;
let memberId: number;

beforeAll(async () => {
  // Create a member for authentication and check-out
  const member = await request(app)
    .post("/auth/register")
    .send({
      name: "Equipment Test",
      email: "equipment@compjunior.com.br",
      password: "password123",
      role: "member"
    });
  
  memberId = member.body.id;

  // Login to obtain token
  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "equipment@compjunior.com.br",
      password: "password123"
    });
  
  authToken = login.body.token;
});

afterAll(async () => {
  // Explicitly close any remaining open handles
  jest.clearAllTimers();
});

describe("Equipment Controller", () => {
  let equipmentId: number;

  beforeEach(async () => {
    const response = await request(app)
      .post("/equipment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Equipment",
        description: "Test Description"
      });
    
    equipmentId = response.body.id;
  });

  it("should create equipment", async () => {
    expect(equipmentId).toBeDefined();
  });

  describe("Check-out Flow", () => {
    it("should check out equipment to a member", async () => {
      const response = await request(app)
        .put(`/equipment/${equipmentId}/check-out`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ memberId });

      expect(response.status).toBe(200);
      expect(response.body.checkedOutBy.id).toBe(memberId);
    });

    it("should check in equipment", async () => {
      // Primeiro faz check-out
      await request(app)
        .put(`/equipment/${equipmentId}/check-out`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ memberId });

      // Depois faz check-in
      const response = await request(app)
        .put(`/equipment/${equipmentId}/check-in`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.checkedOutBy).toBeNull();
    });
  });
});