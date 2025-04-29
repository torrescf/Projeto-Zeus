import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import budgetRoutes from './routes/budget.routes';
import memberRoutes from './routes/member.routes';
import penaltyRoutes from './routes/penalty.routes';
import equipmentRoutes from './routes/equipment.routes';
import projectRoutes from './routes/project.routes';
import clientRoutes from './routes/client.routes';

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API is running!',
    endpoints: {
      auth: '/auth',
      budget: '/budget',
      member: '/member',
    },
  });
});

app.use('/auth', authRoutes); // Ensure this is registered before other routes
app.use('/budget', budgetRoutes);
app.use('/member', memberRoutes);
app.use('/penalty', penaltyRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/project', projectRoutes);
app.use('/client', clientRoutes);

// Health Check
app.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
