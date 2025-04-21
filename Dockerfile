FROM node:18-alpine

WORKDIR /app

# Instalar dependências de compilação
RUN apk add --no-cache make gcc g++ python3

# Copiar dependências
COPY package.json package-lock.json tsconfig.json ./

# Instalar dependências de produção
RUN npm install --only=production

# Copiar o restante do código
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev"]