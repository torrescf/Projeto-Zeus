"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('[DEBUG] Loaded environment variables:', process.env);
console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
const index_1 = require("./index");
const http_1 = require("http");
//import { createConnection, getConnection } from 'typeorm';
jest.mock('typeorm', () => {
    const actualTypeorm = jest.requireActual('typeorm');
    return {
        ...actualTypeorm,
        createConnection: jest.fn().mockImplementation(() => {
            return {
                connect: jest.fn(),
                close: jest.fn(),
                query: jest.fn().mockResolvedValue([]),
                manager: {
                    save: jest.fn().mockResolvedValue({}),
                    find: jest.fn().mockResolvedValue([]),
                },
            };
        }),
        getConnection: jest.fn().mockImplementation(() => {
            return {
                close: jest.fn(),
            };
        }),
    };
});
let server;
beforeAll((done) => {
    server = (0, http_1.createServer)(index_1.app);
    server.listen(4000, () => {
        console.log("[TEST] Servidor de teste iniciado na porta 4000");
        done();
    });
});
afterAll((done) => {
    server.close(() => {
        console.log("[TEST] Servidor de teste encerrado");
        done();
    });
});
//# sourceMappingURL=setupTests.js.map