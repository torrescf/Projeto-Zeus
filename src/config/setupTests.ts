import dotenv from 'dotenv';
dotenv.config();
console.log('[DEBUG] Loaded environment variables:', process.env);
console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
import { app } from "../app/app";
import { createServer } from "http";
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

let server: any;

beforeAll((done) => {
    server = createServer(app);
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