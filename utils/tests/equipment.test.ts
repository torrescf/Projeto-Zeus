import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let equipmentId: number;
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

describe("Equipment Endpoints", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("equipment").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("member").createQueryBuilder().delete().execute();
        // Cria um membro para check-out/check-in
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
        // Cria um equipamento
        const equipmentRes = await request(app)
            .post("/equipment")
            .send({ name: "Laptop", description: "Dell XPS 13" });
        equipmentId = equipmentRes.body.id;
    });

    it("should create equipment", async () => {
        expect(equipmentId).toBeDefined();
    });

    it("should get all equipment", async () => {
        const response = await request(app).get("/equipment");
        expect(response.status).toBe(200);
    });

    it("should get equipment by ID", async () => {
        const response = await request(app).get(`/equipment/${equipmentId}`);
        expect(response.status).toBe(200);
    });

    it("should update equipment", async () => {
        const response = await request(app).put(`/equipment/${equipmentId}`).send({ name: "Updated Laptop" });
        expect(response.status).toBe(204);
    });

    it("should delete equipment", async () => {
        const response = await request(app).delete(`/equipment/${equipmentId}`);
        expect(response.status).toBe(204);
    });
});

describe("Equipment Check-in/Check-out Flow", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("equipment").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("member").createQueryBuilder().delete().execute();
        // Cria um membro e equipamento
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
        const equipmentRes = await request(app)
            .post("/equipment")
            .send({ name: "Laptop", description: "Dell XPS 13" });
        equipmentId = equipmentRes.body.id;
    });

    it("should check out equipment to a member", async () => {
        const response = await request(app)
            .put(`/equipment/${equipmentId}/check-out`)
            .send({ memberId });
        expect(response.status).toBe(200);
        expect(response.body.checkedOutBy).toBeDefined();
    });

    it("should check in equipment", async () => {
        // Primeiro faz o check-out
        await request(app)
            .put(`/equipment/${equipmentId}/check-out`)
            .send({ memberId });
        // Agora faz o check-in
        const response = await request(app)
            .put(`/equipment/${equipmentId}/check-in`);
        expect(response.status).toBe(200);
        expect(response.body.checkedOutBy).toBeNull();
    });
});
