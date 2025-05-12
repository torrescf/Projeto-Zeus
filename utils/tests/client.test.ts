import request from "supertest";
import { app } from "../../src/app/index";

describe("Client Endpoints", () => {
    it("should create a client", async () => {
        const response = await request(app)
            .post("/client")
            .send({ name: "Test Client", email: "client@estudante.ufla.br" }); // Atualizado para email de cliente
        expect(response.status).toBe(201);
    });

    it("should get all clients", async () => {
        const response = await request(app).get("/client");
        expect(response.status).toBe(200);
    });

    it("should get a client by ID", async () => {
        const response = await request(app).get("/client/1");
        expect(response.status).toBe(200);
    });

    it("should update a client", async () => {
        const response = await request(app).put("/client/1").send({ name: "Updated Client" });
        expect(response.status).toBe(204);
    });

    it("should delete a client", async () => {
        const response = await request(app).delete("/client/1");
        expect(response.status).toBe(204);
    });
});
