import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/data-source';
<<<<<<< Updated upstream
import authRoutes from './routes/auth.routes';
import budgetRoutes from './routes/budget.routes';
import memberRoutes from './routes/member.routes';
=======
>>>>>>> Stashed changes

const PORT = process.env.PORT || 4001;

AppDataSource.initialize()
  .then(() => {
    console.log('[DB] Data Source inicializado com sucesso');
<<<<<<< Updated upstream
    
    app = express();
    const port = process.env.PORT || 4001; // Alterar para uma porta diferente

    // ======================
    // Middlewares (ORDEM É CRÍTICA)
    // ======================
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Middleware de log
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
      if (Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
      }
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
          member: '/member'
        }
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
        timestamp: new Date().toISOString()
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
      console.error('[ERROR]', err.stack);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // ======================
    // Inicialização
    // ======================
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`);
      console.log('Rotas disponíveis:');
      console.log(`- POST   /auth/register`);
      console.log(`- POST   /auth/login`);
      console.log(`- GET    /budget/`);
      console.log(`- POST   /budget/`);
      console.log(`- GET    /member/`);
      console.log(`- POST   /member/`);
=======
    app.listen(PORT, () => {
      console.log(`[SERVER] Servidor rodando na porta ${PORT}`);
>>>>>>> Stashed changes
    });
  })
  .catch((error) => {
    console.error('[FATAL] Falha na inicialização:', error);
    process.exit(1);
  });
