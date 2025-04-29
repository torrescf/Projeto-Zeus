import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/data-source";
import * as emailService from "../services/emailService";
import crypto from "crypto";
import { Member } from "../entities/Member";
import { MoreThan } from "typeorm";

jest.mock("../services/emailService");

let resetToken: string;
const memberRepository = AppDataSource.getRepository(Member);

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
      expect(response.body.resetToken).toBeTruthy(); // Verify token is captured
      resetToken = response.body.resetToken; // Save token for reset test
    });

    it("should reset password with valid token", async () => {
      // First, initiate password recovery to generate a token
      const forgotResponse = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "password@compjunior.com.br" });

      // Get the raw token from the response
      resetToken = forgotResponse.body.resetToken;

      // Hash the token the same way the controller does
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      // Add a small delay to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify the token is stored in the database
      const member = await memberRepository.findOne({
        where: {
          email: "password@compjunior.com.br",
          resetPasswordToken: hashedToken,
          resetPasswordExpires: MoreThan(new Date()),
        },
      });

      if (!member) {
        console.error("Member not found with token:", hashedToken);
      }

      // Attempt password reset
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
      process.env.SIMULATE_EMAIL_ERROR = "true"; // Simulate email error
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "password@compjunior.com.br" });

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Erro ao enviar email");
      process.env.SIMULATE_EMAIL_ERROR = "false"; // Reset simulation
    });
  });
});