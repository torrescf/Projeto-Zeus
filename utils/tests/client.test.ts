import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";
import path from "path";

let token: string;
let clientId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // Cria e autentica um client
  await request(app).post("/auth/register-client").send({
    name: "eu teste",
    email: "dejesusmachadojp@gmail.com",
    password: "novaSenhaForte123",
    phone: "123456789",
  });
  const loginRes = await request(app)
    .post("/auth/login")
    .send({
      email: "dejesusmachadojp@gmail.com",
      password: "novaSenhaForte123",
    });
  token = loginRes.body.token;
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Client Endpoints", () => {
  it("should create a client", async () => {
    const res = await request(app)
      .post("/auth/register-client")
      .send({
        name: "Novo Cliente",
        email: "novo_cliente@compjunior.com.br",
        password: "123456",
        phone: "123456789",
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    clientId = res.body.id;
  });

  it("should get all clients", async () => {
    const res = await request(app)
      .get("/client")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a client by ID", async () => {
    const res = await request(app)
      .get(`/client/${clientId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(clientId);
  });

  it("should update a client", async () => {
    const res = await request(app)
      .put(`/client/${clientId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Cliente Atualizado" });
    expect([200, 204]).toContain(res.status);
  });

  it("should upload client photo", async () => {
    const photoPath = path.resolve(__dirname, "../../../uploads/photo-1747970853294-675638323.jpeg");
    const fs = require("fs");
    if (!fs.existsSync(photoPath)) {
      throw new Error(`Test photo not found at path: ${photoPath}`);
    }
    const res = await request(app)
      .post(`/client/upload-photo/${clientId}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", photoPath);
    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
  });

  it("should delete a client", async () => {
    const res = await request(app)
      .delete(`/client/${clientId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });
});
