import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";
import { Client } from "../entities/Client";

let authToken: string;
let memberId: number;
let clientId: number;

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  // Criar um membro para autenticação
  const member = await request(app)
    .post("/auth/register")
    .send({
      name: "Budget Test",
      email: "budget@compjunior.com.br",
      password: "password123",
      role: "admin"
    });
  
  memberId = member.body.id;

  // Login para obter token
  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "budget@compjunior.com.br",
      password: "password123"
    });
  
  authToken = login.body.token;

  // Criar um cliente para testes
  const client = await request(app)
    .post("/client")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      name: "Budget Client",
      email: "client@example.com",
      phone: "123456789"
    });
  
  clientId = client.body.id;
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Budget Controller", () => {
  it("should create a budget", async () => {
    const response = await request(app)
      .post("/budget")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Budget",
        description: "Budget Description",
        amount: 1000,
        clientId
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.createdBy.id).toBe(memberId);
    expect(response.body.client.id).toBe(clientId);
  });

  it("should get all budgets", async () => {
    const response = await request(app)
      .get("/budget")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  describe("Budget Approval Flow", () => {
    let budgetId: number;

    beforeEach(async () => {
      const budget = await request(app)
        .post("/budget")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Approval Test",
          description: "Test Description",
          amount: 2000,
          clientId
        });
      
      budgetId = budget.body.id;
    });

    it("should update budget status", async () => {
      const response = await request(app)
        .put(`/budget/${budgetId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "approved" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("approved");
    });

    it("should create history when status changes", async () => {
      const response = await request(app)
        .get(`/budget/${budgetId}/history`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});