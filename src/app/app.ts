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
import path from 'path';

/**
 * Arquivo principal de configuração e inicialização do servidor Express.
 * Define middlewares, rotas e tratamento de erros para a aplicação.
 */

const app = express();

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

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, 'public')));

// Fallback para SPA (deve vir após as rotas da API, mas antes do 404)
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas agrupadas por prefixo para melhor organização no Swagger
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

// Tratamento de erros
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
