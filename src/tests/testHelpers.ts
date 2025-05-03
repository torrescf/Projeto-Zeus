import request from 'supertest';
import app from "../app";

let authToken: string;

export const getAuthToken = async () => {
    if (!authToken) {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "testadmin@compjunior.com.br",
                password: "testPassword123"
            });
        authToken = response.body.token;
    }
    return authToken;
};

export async function createTestUser(role = 'member') {
    const testEmail = `test${Date.now()}@compjunior.com.br`;
    await request(app).post('/auth/register').send({
        name: "Test User",
        email: testEmail,
        password: "testPassword123",
        role
    });

    const res = await request(app).post('/auth/login').send({
        email: testEmail,
        password: "testPassword123"
    });

    return res.body.token;
}