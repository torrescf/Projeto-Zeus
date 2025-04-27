import request from "supertest";
import { app } from "../index";

describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({ name: "Test User", email: "test@compjunior.com.br", password: "password123" });
        expect(response.status).toBe(201);
    });

    it("should login with valid credentials", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@compjunior.com.br", password: "password123" });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});

describe("Password Recovery Flow", () => {
    it("should reset password with valid token", async () => {
        const response = await request(app)
            .post("/auth/reset-password/valid-token")
            .send({ password: "newpassword123" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password reset successfully");
    });

    it("should not reset password with invalid token", async () => {
        const response = await request(app)
            .post("/auth/reset-password/invalid-token")
            .send({ password: "newpassword123" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid or expired token");
    });
});

describe("Member Endpoints", () => {
    it("should create a member", async () => {
        const response = await request(app)
            .post("/member")
            .send({ name: "Member Test", email: "member@compjunior.com.br", role: "member" });
        expect(response.status).toBe(201);
    });

    it("should get all members", async () => {
        const response = await request(app).get("/member");
        expect(response.status).toBe(200);
    });

    it("should get a member by ID", async () => {
        const response = await request(app).get("/member/1");
        expect(response.status).toBe(200);
    });

    it("should update a member", async () => {
        const response = await request(app).put("/member/1").send({ name: "Updated Member" });
        expect(response.status).toBe(204);
    });

    it("should delete a member", async () => {
        const response = await request(app).delete("/member/1");
        expect(response.status).toBe(204);
    });
});

describe("Budget Endpoints", () => {
    it("should create a budget", async () => {
        const response = await request(app)
            .post("/budget")
            .send({ title: "Test Budget", description: "Test Description", amount: 1000, clientId: 1 });
        expect(response.status).toBe(201);
    });

    it("should get all budgets", async () => {
        const response = await request(app).get("/budget");
        expect(response.status).toBe(200);
    });

    it("should get a budget by ID", async () => {
        const response = await request(app).get("/budget/1");
        expect(response.status).toBe(200);
    });

    it("should update a budget", async () => {
        const response = await request(app).put("/budget/1").send({ title: "Updated Budget" });
        expect(response.status).toBe(200);
    });

    it("should delete a budget", async () => {
        const response = await request(app).delete("/budget/1");
        expect(response.status).toBe(200);
    });
});
