# Script para inicializar a API Zeus

# Limpar builds anteriores
Write-Host "Limpando builds anteriores..."
if (Test-Path -Path "dist") {
    Remove-Item -Recurse -Force "dist"
}
if (Test-Path -Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path -Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

# Reinstalar dependências
Write-Host "Reinstalando dependências..."
npm install

# Compilar o TypeScript
Write-Host "Compilando TypeScript..."
try {
    npm run build
} catch {
    Write-Host "Erro: Falha na compilação do TypeScript. Verifique o código e tente novamente."
    exit 1
}

# Verificar se a compilação do TypeScript gerou os arquivos esperados
Write-Host "Verificando arquivos compilados..."
if (-Not (Test-Path -Path "dist/index.js")) {
    Write-Host "Erro: Arquivo dist/index.js não encontrado. Verifique a etapa de compilação."
    exit 1
}

# Subir os containers com Docker Compose (inclui o banco)
Write-Host "Iniciando os containers com Docker Compose..."
try {
    docker-compose up -d
} catch {
    Write-Host "Erro ao iniciar os containers com Docker Compose. Verifique o arquivo docker-compose.yml e tente novamente."
    exit 1
}

# Esperar o banco de dados ficar pronto
Write-Host "Aguardando o banco de dados ficar pronto..."
Start-Sleep -Seconds 30

# Inicializar o banco de dados (rodar migrações)
Write-Host "Inicializando o banco de dados..."
try {
    docker exec zeus_api npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts
} catch {
    Write-Host "Erro ao executar migrações do TypeORM. Verifique as variáveis de ambiente e o arquivo de configuração."
    exit 1
}

# Verificar se o Docker está instalado
Write-Host "Verificando se o Docker está instalado..."
try {
    docker --version
} catch {
    Write-Host "Erro: Docker não está instalado ou não está no PATH. Instale o Docker antes de continuar."
    exit 1
}

# Verificar se o Docker Desktop está configurado corretamente
Write-Host "Verificando configuração do Docker Desktop..."
try {
    docker info > $null
} catch {
    Write-Host "Erro: Docker Desktop não está configurado corretamente. Verifique se o Docker está em execução."
    exit 1
}

# Construir a imagem Docker
Write-Host "Construindo a imagem Docker..."
try {
    docker build -t zeus-api .
} catch {
    Write-Host "Erro ao construir a imagem Docker. Verifique o Dockerfile e tente novamente."
    exit 1
}

# Iniciar o servidor em modo dev
Write-Host "Iniciando o servidor..."
try {
    npm run dev
} catch {
    Write-Host "Erro ao iniciar o servidor. Verifique os logs para mais detalhes."
    exit 1
}
