"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./config/data-source");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
// Debug inicial
console.log('[INIT] Iniciando servidor...');
let app;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('[DB] Data Source inicializado com sucesso');
    exports.app = app = (0, express_1.default)();
    const port = process.env.PORT || 4001; // Alterar para uma porta diferente
    // ======================
    // Middlewares (ORDEM É CRÍTICA)
    // ======================
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Middleware de log
    app.use((req, res, next) => {
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
    app.get('/', (req, res) => {
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
    app.use('/auth', auth_routes_1.default);
    app.use('/budget', budget_routes_1.default);
    app.use('/member', member_routes_1.default);
    // Health Check
    app.get('/healthcheck', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString()
        });
    });
    // ======================
    // Error Handling
    // ======================
    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({ message: 'Rota não encontrada' });
    });
    // Error handler global
    app.use((err, req, res, next) => {
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
    });
})
    .catch((error) => {
    console.error('[FATAL] Falha na inicialização:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map