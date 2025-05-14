import request from "supertest";
import { app } from "../../src/app/index";
import { AppDataSource } from "../../src/database/data-source";

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
    it("should create a budget with valid data", async () => {
        const response = await request(app)
            .post("/budgets")
            .send({
                numeroOrcamento: "BUD-001",
                descricaoProjeto: "Test Budget",
                cliente: "Test Client",
                membroResponsavel: 1,
                valorEstimado: 1000,
                custosPrevistos: 800
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
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
            .put("/budgets/1")
            .send({ descricaoProjeto: "Updated Budget" });
        expect(response.status).toBe(200);
        expect(response.body.descricaoProjeto).toBe("Updated Budget");
    });

    it("should delete a budget with confirmation", async () => {
        const response = await request(app).delete("/budgets/1?confirm=true");
        expect(response.status).toBe(204);
    });

    it("should list budgets by user", async () => {
        const response = await request(app).get("/budgets/my-budgets");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should change budget status", async () => {
        const response = await request(app)
            .put("/budgets/1/status")
            .send({ status: "aprovado" });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("aprovado");
    });
});
