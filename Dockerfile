FROM node:18-alpine

WORKDIR /app

# 1. Copiar dependências
COPY package.json package-lock.json tsconfig.json ./

# 2. Instalar dependências
RUN npm install

# 3. Copiar o resto do código
COPY . .

# 4. Build do projeto
RUN npm run build

# 5. Limpeza
RUN npm prune --production

EXPOSE 3000
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]