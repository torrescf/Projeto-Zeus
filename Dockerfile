FROM node:18-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copiar código e scripts
COPY . .

RUN ls -lR /app/utils/scripts
RUN chmod +x ./utils/scripts/wait-for-it.sh

# Build para produção
FROM base AS production
RUN npm run build
CMD ["node", "dist/index.js"]

# Desenvolvimento
FROM base AS development
CMD ["npm", "run", "dev"]