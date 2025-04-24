FROM node:18-alpine AS base

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
CMD ["npm", "run", "dev"]