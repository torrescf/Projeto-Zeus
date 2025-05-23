import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";
import path from "path";

let token: string;
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

describe("Member Endpoints", () => {
  it("should create a member", async () => {
    const res = await request(app)
      .post("/member")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nomeCompleto: "Novo Membro",
        email: "novo@compjunior.com.br",
        password: "123456",
        role: "member",
        phone: "123456789"
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    memberId = res.body.id;
  });

  it("should get all members", async () => {
    const res = await request(app)
      .get("/member/public");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a member", async () => {
    const res = await request(app)
      .put(`/member/${memberId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nomeCompleto: "Membro Atualizado" });
    expect(res.status).toBe(200);
    expect(res.body.nomeCompleto).toBe("Membro Atualizado");
  });

  it("should upload member photo", async () => {
    const res = await request(app)
      .post(`/member/upload-photo/${memberId}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", path.resolve(__dirname, "../public/demo.gif"));
    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
  });

  it("should delete a member", async () => {
    const res = await request(app)
      .delete(`/member/${memberId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });
});