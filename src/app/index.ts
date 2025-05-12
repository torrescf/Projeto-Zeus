// Ponto de entrada principal da aplicação.
// Configura o servidor Express, middlewares e rotas.

import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import winston from 'winston';
import { AppDataSource } from '../database/data-source';
import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/member.routes';
import budgetRoutes from './routes/budget.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Carregar variáveis de ambiente
dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new winston.transports.Console()]
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.'
});

let app: Application;

if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      logger.info('[DB] Data Source inicializado com sucesso');

      app = express();
      const port = process.env.PORT || 4001; // Alinhado com o front-end

      app.use(cors(corsOptions));
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ extended: true }));
      app.use(helmet());
      app.use(compression());
      app.use(limiter);
      app.use(express.static('public'));

      app.use((req: Request, res: Response, next: NextFunction) => {
        logger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
        if (Object.keys(req.body).length > 0) {
          logger.info('Body:', req.body);
        }
        next();
      });

      app.use('/auth', authRoutes);
      app.use('/member', memberRoutes);
      app.use('/budget', budgetRoutes);
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

      app.get('/healthcheck', (req: Request, res: Response) => {
        res.status(200).json({
          status: 'OK',
          timestamp: new Date().toISOString()
        });
      });

      app.use((req: Request, res: Response) => {
        res.status(404).json({ message: 'Rota não encontrada' });
      });

      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error('[ERROR]', err.stack);
        res.status(500).json({
          error: 'Erro interno do servidor',
          message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      });

      app.listen(port, () => {
        logger.info(`🚀 Servidor rodando em http://localhost:${port}`);
        logger.info('Rotas disponíveis:');
        logger.info(`- POST   /auth/register`);
        logger.info(`- POST   /auth/login`);
        logger.info(`- GET    /member/`);
        logger.info(`- POST   /member/`);
        logger.info(`- GET    /budget/`);
        logger.info(`- POST   /budget/`);
      });
    })
    .catch((error) => {
      logger.error('[FATAL] Falha na inicialização:', error);
    });
}

export { app };
