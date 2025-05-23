import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let token: string;
let projectId: number;

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

describe("Project Endpoints", () => {
  it("should create a project", async () => {
    const res = await request(app)
      .post("/project")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Projeto Teste",
        description: "Descrição do projeto",
        clientId: 1,
        memberId: 1
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    projectId = res.body.id;
  });

  it("should get all projects", async () => {
    const res = await request(app)
      .get("/project")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a project by ID", async () => {
    const res = await request(app)
      .get(`/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(projectId);
  });

  it("should update a project", async () => {
    const res = await request(app)
      .put(`/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Projeto Atualizado" });
    expect([200, 204]).toContain(res.status);
  });

  it("should delete a project", async () => {
    const res = await request(app)
      .delete(`/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });
});
