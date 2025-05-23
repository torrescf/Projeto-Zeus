import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";
import path from "path";

let token: string;
let equipmentId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // Cria e autentica um membro
  await request(app).post("/member").send({
    nomeCompleto: "Membro",
    email: "membro@compjunior.com.br",
    password: "123456",
    role: "member",
    phone: "123456789"
  });
  const loginRes = await request(app).post("/auth/login").send({
    email: "membro@compjunior.com.br",
    password: "123456"
  });
  token = loginRes.body.token;
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Equipment Endpoints", () => {
  it("should create equipment", async () => {
    const res = await request(app)
      .post("/equipment")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Equipamento Teste", description: "Descrição do equipamento" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    equipmentId = res.body.id;
  });

  it("should get all equipment", async () => {
    const res = await request(app)
      .get("/equipment")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get equipment by ID", async () => {
    const res = await request(app)
      .get(`/equipment/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(equipmentId);
  });

  it("should update equipment", async () => {
    const res = await request(app)
      .put(`/equipment/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Equipamento Atualizado" });
    expect([200, 204]).toContain(res.status);
  });

  it("should delete equipment", async () => {
    const res = await request(app)
      .delete(`/equipment/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });

  it("should upload equipment photo (if implemented)", async () => {
    // Exemplo: se houver rota de upload de foto para equipment
    // const res = await request(app)
    //   .post(`/equipment/upload-photo/${equipmentId}`)
    //   .set("Authorization", `Bearer ${token}`)
    //   .attach("photo", path.resolve(__dirname, "../public/demo.gif"));
    // expect(res.status).toBe(200);
    // expect(res.body.url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
  });
});
