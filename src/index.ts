import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import app from './app';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import budgetRoutes from './routes/budget.routes';
import memberRoutes from './routes/member.routes';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createLogger, format, transports } from 'winston';
import NewRelic from 'newrelic'; // Example for monitoring
import * as Sentry from '@sentry/node';

const PORT = process.env.PORT || 4001;

// Configuração do logger com winston
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    // Example: Send logs to an external service
    new transports.Http({
      host: 'logs.example.com',
      path: '/api/logs',
      ssl: true,
    }),
  ],
});

AppDataSource.initialize()
  .then(async () => {
    logger.info('[DB] Data Source inicializado com sucesso');

    // Run migrations automatically
    await AppDataSource.runMigrations();
    logger.info('[DB] Migrations executadas com sucesso');

    const app = express();

    // Restrict CORS to trusted domains
    app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || [] }));

    // Initialize Sentry
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0, // Adjust sampling rate as needed
    });

    // Middlewares de segurança
    app.use(helmet());
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Limita 100 requisições por 15 minutos

    // Middlewares de parsing
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Middleware de log
    app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
        body: req.body,
      });
      next();
    });

    // ======================
    // Rotas
    // ======================
    // Rota raiz
    app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'API is running!',
        endpoints: {
          auth: '/auth',
          budget: '/budget',
          member: '/member',
        },
      });
    });

    // Rotas principais
    app.use('/auth', authRoutes);
    app.use('/budget', budgetRoutes);
    app.use('/member', memberRoutes);

    // Health Check
    app.get('/healthcheck', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
      });
    });

    // ======================
    // Error Handling
    // ======================
    // 404 Handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({ message: 'Rota não encontrada' });
    });

    // Error handler global
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error('[ERROR]', { stack: err.stack });
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });

    // ======================
    // Inicialização
    // ======================
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log('Rotas disponíveis:');
      console.log(`- POST   /auth/register`);
      console.log(`- POST   /auth/login`);
      console.log(`- GET    /budget/`);
      console.log(`- POST   /budget/`);
      console.log(`- GET    /member/`);
      console.log(`- POST   /member/`);
    });
  })
  .catch((error) => {
    logger.error('[FATAL] Falha na inicialização:', { error });
    process.exit(1);
  });
