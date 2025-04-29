import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";

let authToken: string;

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  // Criar um membro para autenticação
  await request(app)
    .post("/auth/register")
    .send({
      name: "Client Test",
      email: "clienttest@compjunior.com.br",
      password: "password123",
      role: "admin"
    });

  // Login para obter token
  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "clienttest@compjunior.com.br",
      password: "password123"
    });
  
  authToken = login.body.token;
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Client Controller", () => {
  it("should create a client with valid data", async () => {
    const response = await request(app)
      .post("/client")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Client",
        email: "client@example.com",
        phone: "123456789"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get client with budgets", async () => {
    // Primeiro cria um cliente
    const client = await request(app)
      .post("/client")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Client With Budgets",
        email: "client2@example.com",
        phone: "987654321"
      });

    // Cria um orçamento para o cliente
    await request(app)
      .post("/budget")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Client Budget",
        description: "Description",
        amount: 500,
        clientId: client.body.id
      });

    // Busca o cliente com orçamentos
    const response = await request(app)
      .get(`/client/${client.body.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.budgets).toBeDefined();
    expect(response.body.budgets.length).toBe(1);
  });
});