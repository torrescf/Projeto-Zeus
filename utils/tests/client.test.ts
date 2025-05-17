import request from "supertest";
import { app } from "../../src/index";
import { AppDataSource } from "../../src/database/data-source";

let clientId: number;

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

describe("Client Endpoints", () => {
    beforeEach(async () => {
        await AppDataSource.getRepository("client").createQueryBuilder().delete().execute();
        const response = await request(app)
            .post("/client")
            .send({ name: "Test Client", email: "client@estudante.ufla.br" });
        clientId = response.body.id;
    });

    it("should create a client", async () => {
        expect(clientId).toBeDefined();
    });

    it("should get all clients", async () => {
        const response = await request(app).get("/client");
        expect(response.status).toBe(200);
    });

    it("should get a client by ID", async () => {
        const response = await request(app).get(`/client/${clientId}`);
        expect(response.status).toBe(200);
    });

    it("should update a client", async () => {
        const response = await request(app).put(`/client/${clientId}`).send({ name: "Updated Client" });
        expect(response.status).toBe(204);
    });

    it("should delete a client", async () => {
        const response = await request(app).delete(`/client/${clientId}`);
        expect(response.status).toBe(204);
    });
});
