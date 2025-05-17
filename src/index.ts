// Handler global para erros não tratados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

import { app } from './app/app';
import { AppDataSource } from './database/data-source';

const port = process.env.PORT || 3333;

AppDataSource.initialize()
    .then(() => {
        console.log('[DB] Data Source inicializado com sucesso');
        if (process.env.NODE_ENV !== 'test') {
            app.listen(port, () => {
                console.log(`🚀 Servidor rodando em http://localhost:${port}`);
            });
        }
    })
    .catch((error) => {
        console.error('[FATAL] Falha na inicialização:', error);
    });

export { app };