// Handler global para erros não tratados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

import { app } from './app/app';
import { AppDataSource } from './database/data-source';
import path from "path";
import express from "express";

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

// Servir arquivos estáticos do front-end (public)
app.use(express.static(path.join(__dirname, "app", "public")));

// Rota fallback para SPA (opcional, se usar React/Vue/Angular)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "public", "index.html"));
});

export { app };