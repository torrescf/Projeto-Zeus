"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index"); // Certifique-se de exportar o `app` no arquivo `index.ts`
describe('Login', () => {
    it('should block after 5 failed attempts', async () => {
        for (let i = 0; i < 5; i++) {
            await (0, supertest_1.default)(index_1.app).post('/auth/login').send({ email: 'user@comp.com', password: 'wrong' });
        }
        const response = await (0, supertest_1.default)(index_1.app).post('/auth/login').send({ email: 'user@comp.com', password: 'wrong' });
        expect(response.status).toBe(429); // Too Many Requests
    });
});
//# sourceMappingURL=auth.test.js.map