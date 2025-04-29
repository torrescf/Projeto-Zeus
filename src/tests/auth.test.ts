import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";
import * as emailService from "../services/emailService";

jest.mock("../services/emailService");

let resetToken: string;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true);
  }
});

beforeEach(async () => {
  // Reset database state between tests
  await AppDataSource.synchronize(true);

  // Mock email service to capture the reset token
  jest.spyOn(emailService, "sendPasswordResetEmail").mockImplementation(async (email, token) => {
    if (email === "password@compjunior.com.br") {
      resetToken = token; // Capture the token for testing
    }
  });

  // Create a test user for password recovery
  await request(app).post("/auth/register").send({
    name: "Password Test",
    email: "password@compjunior.com.br",
    password: "originalPassword",
  });
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Auth Controller", () => {
  describe("POST /auth/register", () => {
    it("should register a new member with valid data", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "Test Member",
          email: "test@compjunior.com.br",
          password: "securePassword123",
          role: "member"
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe("test@compjunior.com.br");
    });

    it("should reject registration with invalid email domain", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "Invalid Email",
          email: "test@gmail.com",
          password: "password123"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("O e-mail deve pertencer ao domínio @compjunior.com.br");
    });

    it("should reject registration with existing email", async () => {
      await request(app).post("/auth/register").send({
        name: "Existing User",
        email: "existing@compjunior.com.br",
        password: "password123"
      });

      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "Existing User",
          email: "existing@compjunior.com.br",
          password: "password123"
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/auth/register").send({
        name: "Login Test",
        email: "login@compjunior.com.br",
        password: "loginPassword123"
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "login@compjunior.com.br",
          password: "loginPassword123"
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should reject login with invalid password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "login@compjunior.com.br",
          password: "wrongPassword"
        });

      expect(response.status).toBe(401);
    });
  });

  describe("Password Recovery", () => {
    it("should initiate password recovery", async () => {
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "password@compjunior.com.br" });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("Email de redefinição de senha enviado");
      expect(resetToken).toBeTruthy(); // Verify token is captured
    });

    it("should reset password with valid token", async () => {
      // First get a valid token
      await request(app)
        .post("/auth/forgot-password")
        .send({ email: "password@compjunior.com.br" });

      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send({ password: "newPassword123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("Senha redefinida com sucesso");
    });

    it("should handle invalid tokens", async () => {
      const response = await request(app)
        .post("/auth/reset-password/invalid-token")
        .send({ password: "newPassword123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Token inválido ou expirado");
    });

    it("should handle email sending errors gracefully", async () => {
      jest.spyOn(emailService, "sendPasswordResetEmail").mockImplementationOnce(() => {
        throw new Error("Email service error");
      });

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "password@compjunior.com.br" });

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Erro ao enviar email");
    });
  });
});