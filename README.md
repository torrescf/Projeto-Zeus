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
2. Configure o arquivo `.env` com as variáveis necessárias:
   ```env
   PORT=4001
   JWT_SECRET=sua_chave_secreta
   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=147afj
   DB_NAME=zeus_admin
   CLOUDINARY_CLOUD_NAME=seu_cloud_name
   CLOUDINARY_API_KEY=sua_api_key
   CLOUDINARY_API_SECRET=sua_api_secret
   ```
3. Suba os containers:
   ```bash
   docker-compose up -d --build
   ```
4. Acesse a API em `http://localhost:4001` e o Swagger em `/api-docs`.

## 📝 Exemplos de Uso da API

### Cadastro de Cliente
**POST /client/register**
```json
{
  "name": "Maria Silva",
  "email": "maria@exemplo.com",
  "password": "senha123",
  "phone": "11999999999"
}
```

### Upload de Foto de Perfil do Cliente
**POST /client/upload-photo/{id}**
- Form-data: campo `photo` (arquivo)
- Retorna a URL da foto no Cloudinary

### Criar Projeto
**POST /project**
```json
{
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "clientId": 1,
  "amount": 1200.50
}
```

### Resposta de Projeto
```json
{
  "id": 1,
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "amount": 1200.5,
  "client": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "phone": "11999999999",
    "created_at": "2025-05-23T02:47:46.766Z",
    "resetPasswordToken": null,
    "resetPasswordExpires": null,
    "photoUrl": "https://res.cloudinary.com/..."
  },
  "created_at": "2025-05-23T03:01:15.856Z",
  "status": "em analise"
}
```

### Buscar todos os projetos
**GET /project**
- Retorna lista de projetos com dados do cliente (sem senha)

### Cadastro de Membro
**POST /member**
```json
{
  "nomeCompleto": "João Pedro Oliveira",
  "email": "joao@compjunior.com.br",
  "password": "senha123",
  "role": "member",
  "phone": "11999999999",
  "skills": ["Node.js", "TypeScript"]
}
```

### Penalidades
**POST /penalty**
```json
{
  "type": "warning",
  "reason": "Atraso no projeto",
  "date": "2025-05-23",
  "memberId": 1
}
```

## 🔐 Variáveis de Ambiente
Veja `.env.example` ou a seção de configuração acima.

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

## 🏆 Autor
[João Pedro Oliveira](https://github.com/torrescf)

---

> Projeto desenvolvido para Comp Júnior – 2025.
