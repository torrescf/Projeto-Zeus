\connect template1
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cria o banco zeus_admin se não existir (sintaxe correta)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'zeus_admin') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE zeus_admin');
    END IF;
END $$;

-- Conecta ao banco zeus_admin
\connect zeus_admin

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