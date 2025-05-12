"use strict";
// Ponto de entrada principal da aplicação.
// Configura o servidor Express, middlewares e rotas.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const data_source_1 = require("../database/data-source");
const authRoutes = require('./routes/auth.routes');
const member_routes_1 = __importDefault(require("../../dist/routes/member.routes"));
const budget_routes_1 = __importDefault(require("../../dist/routes/budget.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [new winston_1.default.transports.Console()]
});
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.'
});
let app;
if (process.env.NODE_ENV !== "test") {
    data_source_1.AppDataSource.initialize()
        .then(() => {
        logger.info('[DB] Data Source inicializado com sucesso');
        exports.app = app = (0, express_1.default)();
        const port = process.env.PORT || 3333;
        app.use((0, cors_1.default)(corsOptions));
        app.use(express_1.default.json({ limit: '50mb' }));
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, helmet_1.default)());
        app.use((0, compression_1.default)());
        app.use(limiter);
        app.use(express_1.default.static('public'));
        app.use((req, res, next) => {
            logger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
            if (Object.keys(req.body).length > 0) {
                logger.info('Body:', req.body);
            }
            next();
        });
        app.use('/auth', authRoutes);
        app.use('/member', member_routes_1.default);
        app.use('/budget', budget_routes_1.default);
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        app.get('/healthcheck', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString()
            });
        });
        app.use((req, res) => {
            res.status(404).json({ message: 'Rota não encontrada' });
        });
        app.use((err, req, res, next) => {
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
//# sourceMappingURL=index.js.map