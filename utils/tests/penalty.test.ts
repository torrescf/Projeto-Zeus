import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let token: string;
let penaltyId: number;
let memberId: number;

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

describe("Penalty Endpoints", () => {
  it("should create a penalty", async () => {
    // Cria um membro para associar à penalidade
    const memberRes = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nomeCompleto: "Membro Penalidade",
        email: "penalidade@compjunior.com.br",
        password: "123456",
        role: "member",
        phone: "123456789"
      });
    memberId = memberRes.body.id;
    const res = await request(app)
      .post("/penalty")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "warning", reason: "Test reason", date: "2025-05-20", memberId });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    penaltyId = res.body.id;
  });

  it("should get all penalties", async () => {
    const res = await request(app)
      .get("/penalty")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a penalty by ID", async () => {
    const res = await request(app)
      .get(`/penalty/${penaltyId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(penaltyId);
  });

  it("should update a penalty", async () => {
    const res = await request(app)
      .put(`/penalty/${penaltyId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ reason: "Motivo atualizado" });
    expect([200, 204]).toContain(res.status);
  });

  it("should delete a penalty", async () => {
    const res = await request(app)
      .delete(`/penalty/${penaltyId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });
});
