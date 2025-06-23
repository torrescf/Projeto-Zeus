# Projeto Zeus

Sistema interno para gestão de membros, clientes, projetos e orçamentos da Comp Júnior.

## 🚀 Tecnologias Utilizadas
- **Node.js** + **TypeScript**
- **Express**
- **PostgreSQL** + **TypeORM**
- **Docker** e **Docker Compose**
- **Multer** (upload de arquivos)
- **Cloudinary** (armazenamento de fotos de perfil)
- **JWT** (autenticação)
- **Jest** (testes)

## 📦 Funcionalidades Principais
- **Autenticação**: login, JWT, recuperação e redefinição de senha
- **Clientes**: cadastro, consulta, upload de foto de perfil (Cloudinary)
- **Membros**: cadastro, consulta, penalidades, validação de e-mail institucional
- **Projetos**: CRUD de projetos vinculados a clientes, campo amount (valor numérico)
- **Orçamentos**: CRUD de orçamentos
- **Equipamentos**: check-in/check-out
- **Swagger**: documentação interativa da API

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js v16+
- Docker e Docker Compose

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/projeto-zeus.git
   cd projeto-zeus
   ```
2. ## 🔐 Variáveis de Ambiente
Crie e configure o arquivo `.env` com as variáveis necessárias:
   ```env
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASSWORD=senha_do_banco
  DB_NAME=zeus_admin
  JWT_SECRET=sua_chave_secreta_forte_aqui
  NODE_ENV=development
  FRONTEND_URL=http://localhost:5173
  PORT=4001
  DATABASE_URL=postgres://postgres:senha_do_banco@localhost:5432/zeus_admin
  EMAIL_USER=seu_email@gmail.com
  EMAIL_PASS=sua_senha_de_app
  APP_URL=http://localhost:4001
  CLOUDINARY_CLOUD_NAME=nome_da_sua_cloud
  CLOUDINARY_API_KEY=sua_api_key
  CLOUDINARY_API_SECRET=sua_api_secret
     
3. Rode a API executando:
  ```bash
  ./src/utils/scripts/start-api.ps1
  ```

## 🧑‍💻 Padrões de Código e Git
- camelCase para variáveis e funções
- Funções pequenas, comentadas e com responsabilidade única
- Commits semânticos ([padrão iuricode](https://github.com/iuricode/padroes-de-commits))
- Branches: `main` (estável), `back` (atualizada), `feature/`, `bugfix/`, `hotfix/`, `refactor/`

## 🗂️ Estrutura de Pastas
```
src/
  app/           # Configuração principal, rotas, swagger
  controllers/   # Lógica das rotas
  database/      # Entidades, migrations, init.sql
  middlewares/   # Middlewares
  services/      # Serviços auxiliares
  uploads/       # Uploads temporários
  utils/         # Scripts auxiliares
```

## 📚 Documentação Swagger
- O arquivo `src/app/swagger.json` está alinhado com a API real.
- Teste endpoints diretamente pela interface Swagger.

4. Acesse a API em `http://localhost:4001` e o Swagger em `/api-docs`.
## 📝 Exemplos de Uso da API

### Cadastro de Cliente
**POST /auth/register-client**
```json
{
  "name": "Maria Silva",
  "email": "maria@exemplo.com",
  "password": "senha123",
  "role": "client",
  "phone": "(11) 99999-9999",
  "gender": "F",
  "skills": "Node, React",
  "data_nascimento": "1995-05-23"
}
```

### Login
**POST /auth/login**
```json
{
  "email": "maria@exemplo.com",
  "password": "senha123"
}
```

### Esqueci a senha
**POST /auth/forgot-password**
```json
{
  "email": "maria@exemplo.com"
}
```

### Redefinir senha
**POST /auth/reset-password/:token**
```json
{
  "password": "novaSenhaForte123"
}
```

### Buscar todos os clientes
**GET /client**

### Buscar cliente por ID
**GET /client/{client_id}**

### Atualizar cliente
**PUT /client/{client_id}**
```json
{
  "name": "Cliente Atualizado",
  "email": "cliente@estudante.ufla.br",
  "phone": "987654321"
}
```

### Deletar cliente
**DELETE /client/{client_id}**

### Upload de Foto de Perfil do Cliente
**POST /upload-photo/{client_id}**
- Form-data: campo `photo` (arquivo)
- Retorna a URL da foto no Cloudinary

---

### Cadastro de Membro
**POST /auth/register**
```json
{
  "nomeCompleto": "João Pedro Oliveira",
  "email": "joao@compjunior.com.br",
  "password": "senha123",
  "role": "member",
  "phone": "(11) 99999-9999",
  "gender": "M",
  "skills": "Node.js, TypeScript",
  "data_nascimento": "2000-01-01"
}
```

### Buscar todos os membros
**GET /list/members**

### Atualizar membro
**PUT /member/{member_id}**
```json
{
  "nomeCompleto": "Membro Atualizado",
  "email": "atualizado@compjunior.com.br",
  "role": "admin"
}
```

### Deletar membro
**DELETE /member/{member_id}**

### Upload de Foto de Perfil do Membro
**POST /client/upload-photo/{member_id}**
- Form-data: campo `photo` (arquivo)
- Retorna a URL da foto no Cloudinary

---

### Criar Projeto
**POST /project**
```json
{
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "clientId": 1,
  "memberId": 1
}
```

### Buscar todos os projetos
**GET /project**

### Atualizar projeto
**PUT /project/{project_id}**
```json
{
  "name": "Projeto Atualizado",
  "description": "Nova descrição",
  "status": "aprovado"
}
```

### Deletar projeto
**DELETE /project/{project_id}**

---

### Criar Equipamento
**POST /equipment**
```json
{
  "name": "Notebook Dell",
  "description": "Notebook para desenvolvimento"
}
```

### Buscar todos os equipamentos
**GET /equipment**

### Atualizar equipamento
**PUT /equipment/{equipment_id}**
```json
{
  "name": "Notebook Atualizado",
  "description": "Nova descrição"
}
```

### Deletar equipamento
**DELETE /equipment/{equipment_id}**

---

### Criar Penalidade
**POST /penalty**
```json
{
  "type": "warning",
  "reason": "Atraso",
  "date": "2025-05-20",
  "memberId": 1
}
```

### Buscar todas as penalidades
**GET /penalty**

### Atualizar penalidade
**PUT /penalty/{penalty_id}**
```json
{
  "type": "suspension",
  "reason": "Motivo atualizado"
}
```

### Deletar penalidade
**DELETE /penalty/{penalty_id}**


## 🏆 Autor
[João Pedro Oliveira](https://github.com/torrescf)

---

> Projeto desenvolvido para Comp Júnior – 2025.
