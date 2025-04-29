import app from '../app';
import request from 'supertest';
import { initializeDatabase, closeDatabase, AppDataSource } from '../config/data-source';
import { Server } from 'http';

declare global {
  var authToken: string;
  var baseUrl: string;
  var testServer: Server;
}

beforeAll(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('[DB] Data Source initialized successfully');
    }

    global.testServer = app.listen(0); // Assign to global.testServer
    const address = global.testServer.address();
    global.baseUrl = typeof address === 'string' ? address : `http://127.0.0.1:${address?.port}`;

    // Create test admin user
    await request(global.baseUrl)
      .post('/auth/register')
      .send({
        name: 'Test Admin',
        email: 'admin@compjunior.com.br',
        password: 'adminPassword123',
        role: 'admin',
      });

    const loginResponse = await request(global.baseUrl)
      .post('/auth/login')
      .send({
        email: 'admin@compjunior.com.br',
        password: 'adminPassword123',
      });

    global.authToken = loginResponse.body.token;
  } catch (error) {
    console.error('Test setup failed:', error);
    process.exit(1);
  }
});

beforeEach(async () => {
  // Reset database state between tests
  await AppDataSource.synchronize(true);
});

afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('[DB] Data Source closed');
    }
    global.testServer?.close();
    await closeDatabase();
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
});