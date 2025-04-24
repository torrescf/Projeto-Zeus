import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente mais tarde.'
});
