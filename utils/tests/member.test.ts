import request from "supertest";
import { app } from "../../src/app/index";

describe("Member Endpoints", () => {
    it("should create a member with valid data", async () => {
        const response = await request(app)
            .post("/members")
            .send({
                nomeCompleto: "Test Member",
                dataNascimento: "2000-01-01",
                emailInstitucional: "test@compjunior.com.br", // Atualizado para o domínio correto
                cargo: "Developer",
                telefone: "123456789",
                genero: "Masculino",
                dataIngresso: "2023-01-01",
                habilidades: ["Node.js", "TypeScript"]
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
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
            .put("/members/1")
            .send({ nomeCompleto: "Updated Member" });
        expect(response.status).toBe(200);
        expect(response.body.nomeCompleto).toBe("Updated Member");
    });

    it("should delete a member with confirmation", async () => {
        const response = await request(app).delete("/members/1?confirm=true");
        expect(response.status).toBe(204);
    });
});