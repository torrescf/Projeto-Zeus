FROM node:18-alpine AS base

RUN apk add --no-cache postgresql-client

WORKDIR /app

# Instalar dependências

COPY package.json package-lock.json ./
RUN npm install

# Copiar código
COPY . .

# Build para produção
FROM base AS production
RUN npm run build
CMD ["node", "dist/index.js"]

# Desenvolvimento
FROM base AS development
CMD ["sh", "-c", "while ! pg_isready -h db -U postgres; do sleep 1; done && npm run dev"]