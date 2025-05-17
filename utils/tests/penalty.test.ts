import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let penaltyId: number;
let memberId: number;

describe("Penalty Endpoints", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("penalty").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("member").createQueryBuilder().delete().execute();
        // Cria um membro para associar à penalidade
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
        // Cria uma penalidade
        const penaltyRes = await request(app)
            .post("/penalty")
            .send({ type: "warning", reason: "Test reason", date: "2023-10-01", memberId });
        penaltyId = penaltyRes.body.id;
    });

    it("should create a penalty", async () => {
        expect(penaltyId).toBeDefined();
    });

    it("should get all penalties", async () => {
        const response = await request(app).get("/penalty");
        expect(response.status).toBe(200);
    });

    it("should get a penalty by ID", async () => {
        const response = await request(app).get(`/penalty/${penaltyId}`);
        expect(response.status).toBe(200);
    });

    it("should update a penalty", async () => {
        const response = await request(app).put(`/penalty/${penaltyId}`).send({ reason: "Updated reason" });
        expect(response.status).toBe(204);
    });

    it("should delete a penalty", async () => {
        const response = await request(app).delete(`/penalty/${penaltyId}`);
        expect(response.status).toBe(204);
    });
});
