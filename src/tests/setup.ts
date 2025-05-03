import app from '../app';
import request from 'supertest';
import Database from "../config/data-source";
import { Server } from 'http';

declare global {
  var authToken: string;
  var testServer: Server;
}

beforeAll(async () => {
  try {
    // Initialize the database
    const dataSource = await Database.getInstance();
    await dataSource.synchronize(true);

    // Set up the test server
    global.testServer = app.listen(0);

    // Create a test admin user
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123',
      });

    global.authToken = loginResponse.body.token;
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error; // Avoid using process.exit()
  }
}, 15000); // Increased timeout

afterEach(async () => {
  const dataSource = await Database.getInstance();
  await dataSource.query("TRUNCATE TABLE clients, members, budgets, projects CASCADE");
});

afterAll(async () => {
  await Database.destroy();
  global.testServer?.close();
});