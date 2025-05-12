FROM node:18-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copiar o script wait-for-it.sh para o contexto de build
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copiar código
COPY . .

# Build para produção
FROM base AS production
RUN npm run build
CMD ["node", "dist/index.js"]

# Desenvolvimento
FROM base AS development
CMD ["npm", "run", "dev"]