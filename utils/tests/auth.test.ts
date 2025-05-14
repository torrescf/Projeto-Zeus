// Testes automatizados para endpoints de autenticação.
// Inclui casos de teste para login e proteção contra força bruta.

import request from "supertest";
import { app } from "../../src/app/index"; // Certifique-se de exportar o `app` no arquivo `index.ts`
import { AppDataSource } from "../../src/database/data-source"; // adjust path as needed

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  // Force exit for Jest if needed (for debugging only)
  // setTimeout(() => process.exit(0), 500);
});

describe('Login', () => {
  it('should block after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/auth/login').send({ email: 'user@comp.com', password: 'wrong' });
    }
    const response = await request(app).post('/auth/login').send({ email: 'user@comp.com', password: 'wrong' });
    expect(response.status).toBe(429); // Too Many Requests
  });
});
