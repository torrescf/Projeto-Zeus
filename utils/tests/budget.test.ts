import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let budgetId: number;
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

describe("Budget Endpoints", () => {
    beforeEach(async () => {
        // Ordem correta para evitar FK: budget_history -> budget -> member
        await AppDataSource.getRepository("budget_history").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("budget").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("member").createQueryBuilder().delete().execute();
        // Cria um membro para ser responsável pelo orçamento
        const memberRes = await request(app)
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
        memberId = memberRes.body.id;
        // Cria um orçamento
        const budgetRes = await request(app)
            .post("/budgets")
            .send({
                numeroOrcamento: "BUD-001",
                descricaoProjeto: "Test Budget",
                cliente: "Test Client",
                membroResponsavel: memberId,
                valorEstimado: 1000,
                custosPrevistos: 800
            });
        budgetId = budgetRes.body.id;
    });

    it("should create a budget with valid data", async () => {
        expect(budgetId).toBeDefined();
    });

    it("should not create a budget with missing fields", async () => {
        const response = await request(app)
            .post("/budgets")
            .send({
                numeroOrcamento: "BUD-002",
                descricaoProjeto: "Incomplete Budget"
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Todos os campos obrigatórios devem ser preenchidos");
    });

    it("should get all budgets", async () => {
        const response = await request(app).get("/budgets");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should update a budget", async () => {
        const response = await request(app)
            .put(`/budgets/${budgetId}`)
            .send({ descricaoProjeto: "Updated Budget" });
        expect(response.status).toBe(200);
        expect(response.body.descricaoProjeto).toBe("Updated Budget");
    });

    it("should delete a budget with confirmation", async () => {
        const response = await request(app).delete(`/budgets/${budgetId}?confirm=true`);
        expect(response.status).toBe(204);
    });

    it("should list budgets by user", async () => {
        const response = await request(app).get("/budgets/my-budgets");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should change budget status", async () => {
        const response = await request(app)
            .put(`/budgets/${budgetId}/status`)
            .send({ status: "aprovado" });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("aprovado");
    });
});
