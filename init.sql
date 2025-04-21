-- Cria a extensão para UUIDs (executa no banco template1 primeiro)
\c template1
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cria o banco zeus_admin se não existir (sintaxe correta)
SELECT 'CREATE DATABASE zeus_admin'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'zeus_admin')\gexec

-- Conecta ao banco zeus_admin
\c zeus_admin

-- Recria a extensão no banco zeus_admin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de membros
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);