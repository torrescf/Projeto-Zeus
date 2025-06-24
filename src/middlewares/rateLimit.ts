// Middleware para limitar o número de requisições em endpoints sensíveis.
// Protege contra ataques de força bruta, como tentativas de login excessivas.

import rateLimit from 'express-rate-limit';

// Middleware para limitar tentativas de login
export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutos
    max: 10, // Limite de 5 tentativas
    message: {
        message: 'Muitas tentativas de login. Tente novamente mais tarde.'
    },
    standardHeaders: true, // Retorna informações de limite no cabeçalho `RateLimit-*`
    legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*`
});
