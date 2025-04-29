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