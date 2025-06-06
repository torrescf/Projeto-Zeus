﻿-- Script de inicialização do banco de dados Zeus
-- Configurações iniciais, criação de tabelas e extensões necessárias.

\connect template1
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cria o banco zeus_admin se não existir
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
    nomeCompleto VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    isActive BOOLEAN DEFAULT FALSE,
    skills TEXT[],
    gender VARCHAR(20),
    phone VARCHAR(50),
    photo VARCHAR(255),
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_nascimento DATE
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    photoUrl VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires TIMESTAMP,
    data_nascimento DATE
);

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    client_id INT NOT NULL,
    amount NUMERIC(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Em analise',
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
);

-- Tabela de equipamentos
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "checkedOutById" INT,
    FOREIGN KEY ("checkedOutById") REFERENCES members(id) ON DELETE SET NULL
);

-- Tabela de penalidades
CREATE TABLE IF NOT EXISTS penalty (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    memberId INT NOT NULL,
    CONSTRAINT FK_member_penalty FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members (email);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects (client_id);
CREATE INDEX IF NOT EXISTS idx_budgets_project_id ON budgets (project_id);