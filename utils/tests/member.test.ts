import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let memberId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Member Endpoints", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("member").createQueryBuilder().delete().execute();
        // Cria um membro para os testes que precisam de um ID existente
        const response = await request(app)
            .post("/members")
            .send({
                nomeCompleto: "Test Member",
                dataNascimento: "2000-01-01",
                emailInstitucional: "test@compjunior.com.br",
                cargo: "Developer",
                telefone: "123456789",
                genero: "Masculino",
                dataIngresso: "2023-01-01",
                habilidades: ["Node.js", "TypeScript"]
            });
        memberId = response.body.id;
    });

    it("should create a member with valid data", async () => {
        // O beforeEach já criou um membro, então só verifica o status
        expect(memberId).toBeDefined();
    });

    it("should not create a member with invalid email domain", async () => {
        const response = await request(app)
            .post("/members")
            .send({
                nomeCompleto: "Invalid Email Member",
                dataNascimento: "2000-01-01",
                emailInstitucional: "test@gmail.com",
                cargo: "Developer",
                telefone: "123456789",
                genero: "Masculino",
                dataIngresso: "2023-01-01",
                habilidades: ["Node.js", "TypeScript"]
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O email deve pertencer ao domínio compjunior.ufl.edu.br");
    });

    it("should get all members", async () => {
        const response = await request(app).get("/members");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should update a member", async () => {
        const response = await request(app)
            .put(`/members/${memberId}`)
            .send({ nomeCompleto: "Updated Member" });
        expect(response.status).toBe(200);
        expect(response.body.nomeCompleto).toBe("Updated Member");
    });

    it("should delete a member with confirmation", async () => {
        const response = await request(app).delete(`/members/${memberId}?confirm=true`);
        expect(response.status).toBe(204);
    });
});