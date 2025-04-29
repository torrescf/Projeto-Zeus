import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // Use .env em produção
const TOKEN_EXPIRATION = "15m"; // Tempo de expiração para token de recuperação

/**
 * Gera um token JWT para recuperação de senha com base no e-mail do usuário.
 */
export function generateResetToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

/**
 * Valida um token de recuperação de senha e retorna o e-mail se for válido.
 */
export function verifyResetToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch (err) {
    return null;
  }
}
