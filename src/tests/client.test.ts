import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";

describe("Client Controller", () => {
  let authToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.synchronize(true);
    }

    // Create test admin user
    await request(app)
      .post("/auth/register")
      .send({
        name: "Test Admin",
        email: "admin@compjunior.com.br",
        password: "adminPassword123",
        role: "admin",
      });

    // Login to get token
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@compjunior.com.br",
        password: "adminPassword123",
      });

    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await AppDataSource.synchronize(true); // Reset database state
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("should create a client with valid data", async () => {
    const response = await request(app)
      .post("/client")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Client",
        email: "client@example.com",
        phone: "123456789",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get client with budgets", async () => {
    // Create client
    const clientResponse = await request(app)
      .post("/client")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Client With Budget",
        email: "client2@example.com",
        phone: "987654321",
      });

    // Create budget for client
    await request(app)
      .post("/budget")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Client Budget",
        description: "Description",
        amount: 500,
        clientId: clientResponse.body.id,
      });

    // Get client with budgets
    const response = await request(app)
      .get(`/client/${clientResponse.body.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.budgets).toBeDefined();
    expect(response.body.budgets.length).toBe(1);
  });
});