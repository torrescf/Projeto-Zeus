import { app } from './app/app';
import { AppDataSource } from './database/data-source';

const port = process.env.PORT || 3333;

AppDataSource.initialize()
    .then(() => {
        console.log('[DB] Data Source inicializado com sucesso');
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('[FATAL] Falha na inicialização:', error);
    });