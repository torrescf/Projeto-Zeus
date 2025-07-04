import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/member.routes';
import clientRoutes from './routes/client.routes';
import equipmentRoutes from './routes/equipment.routes';
import penaltyRoutes from './routes/penalty.routes';
import projectRoutes from './routes/project.routes';
import { createBudgetByClientId } from '../controllers/BudgetController';

/**
 * Arquivo principal de configuração e inicialização do servidor Express.
 * Define middlewares, rotas e tratamento de erros para a aplicação.
 */

const app = express();

// Confiança em proxy para uso correto do X-Forwarded-For (ngrok, proxies, etc)
app.set('trust proxy', 1);

// Configurações de segurança e middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(helmet());
app.use(compression());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.'
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger deve vir antes das rotas dinâmicas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas de API
app.use('/client', clientRoutes);
app.use('/auth', authRoutes);
app.use('/member', memberRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/penalty', penaltyRoutes);
app.use('/project', projectRoutes);
app.post('/budgets-create', createBudgetByClientId);

// Rota de verificação de saúde
app.get('/healthcheck', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Tratamento de erros (deve ser o último)
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export { app };
