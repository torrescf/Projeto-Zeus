# Projeto Zeus

## 🎥 Demonstração da Interface Visual
Veja abaixo uma demonstração da interface visual da API:

![Demonstração da Interface](./public/demo.gif)

## Descrição
Projeto Zeus é um sistema interno desenvolvido para a Comp Júnior, utilizando Node.js, TypeScript, PostgreSQL e TypeORM. Ele oferece funcionalidades para gerenciar membros, orçamentos e autenticação de usuários.

## Stack Tecnológica
- **Node.js**: Plataforma de execução JavaScript.
- **TypeScript**: Superset de JavaScript com tipagem estática.
- **PostgreSQL**: Banco de dados relacional.
- **TypeORM**: ORM para manipulação de banco de dados.
- **Express**: Framework web para Node.js.
- **Bibliotecas Adicionais**:
  - `bcrypt`: Hash de senhas.
  - `jsonwebtoken`: Geração e validação de tokens JWT.
  - `express-validator`: Validação de dados.
  - `multer`: Upload de arquivos.

## Funcionalidades
1. **Autenticação**:
   - Login com validação de credenciais e geração de JWT.
   - Recuperação e redefinição de senha.
   - Limitação de tentativas de login para evitar ataques de força bruta.

2. **Gerenciamento de Membros**:
   - CRUD completo para membros.
   - Upload de fotos.
   - Validação de dados, como email institucional e datas.

3. **Gerenciamento de Orçamentos**:
   - CRUD completo para orçamentos.
   - Alteração de status (em análise, aprovado, reprovado).
   - Validação de campos obrigatórios.

## Configuração do Ambiente
### Pré-requisitos
- Node.js (v16 ou superior)
- Docker e Docker Compose

### Passos para Configuração
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/projeto-zeus.git
   cd projeto-zeus
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   PORT=4001
   JWT_SECRET=sua_chave_secreta
   DATABASE_URL=postgres://usuario:senha@localhost:5432/zeus
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASS=sua_senha
   ```

3. Suba os containers Docker:
   ```bash
   docker-compose up -d --build
   ```

4. Acesse a aplicação em `http://localhost:4001`.

## Testes
Execute os testes automatizados com Jest:
```bash
npm test
```

## Como Contribuir
1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m 'Minha nova feature'
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## Licença
Este projeto está licenciado sob a licença MIT.

## 🧑‍💻 Regras de código adotadas

- Uso do padrão **camelCase** para variáveis e funções.
- Funções devem seguir o princípio da **Single Responsibility**.
- Limitação de 25 linhas por função.
- Comentários explicativos obrigatórios para cada função.
- Aplicação do princípio **DRY** (Don't Repeat Yourself).
- Tratamento de erros padronizado em toda a aplicação.

## 🧑‍💻 Regras e padrões de Git adotadas

- Commits devem seguir o padrão de commits semânticos, conforme [esta documentação](https://github.com/iuricode/padroes-de-commits).
- A branch `main` deve conter o código mais estável.
- A branch `back` deve conter o código mais atualizado.
- Para cada nova funcionalidade ou correção, deve ser criada uma branch de trabalho com a seguinte nomenclatura:
  - **feature/**: Para novas funcionalidades.  
    Exemplo: `feature/rota-login`.
  - **bugfix/**: Para correções de bugs.  
    Exemplo: `bugfix/corrigir-login`.
  - **hotfix/**: Para correções urgentes em produção.  
    Exemplo: `hotfix/corrigir-token`.
  - **refactor/**: Para refatoração de código.  
    Exemplo: `refactor/refatorar-autenticacao`.
- Após concluir as alterações, deve ser criado um Pull Request para a branch `back`.
- A cada 2 dias, a branch `back` deve ser mergeada na `main`, garantindo que o código esteja funcional e consistente.

## 🔐 Arquivo .env

As seguintes variáveis de ambiente são necessárias para o funcionamento do sistema:

```env
DB_HOST= host do seu banco de dados
DB_PORT= porta do seu banco de dados 
DB_USER= Seu usuário do banco de dados
DB_PASSWORD= Sua senha do banco de dados
DB_NAME= nome do banco de dados
JWT_SECRET= sua chave secreta
EMAIL_USER= seu email
EMAIL_PASS= sua senha
```

### Estrutura de Pastas 

```
src/
├── app/                     # Configurações principais da aplicação
│   ├── app.js               # Configuração do Express
│   ├── index.js             # Ponto de entrada da aplicação
│   ├── swagger.json         # Configuração do Swagger
│   ├── data-source.ts       # Configuração do banco de dados
│   ├── setupTests.ts        # Configuração de testes
├── controllers/             # Controladores das rotas
├── entities/                # Entidades do banco de dados (TypeORM)
├── middlewares/             # Middlewares de autenticação e validação
├── routes/                  # Definição das rotas da API
├── services/                # Lógica de negócios
├── tests/                   # Testes automatizados
public/                      # Arquivos estáticos
scripts/                     # Scripts auxiliares
.env                          # Variáveis de ambiente
package.json                  # Dependências e scripts do projeto
tsconfig.json                 # Configuração do TypeScript
jest.config.js                # Configuração do Jest
```

## Justificativa do Banco de Dados

Optei por utilizar o **PostgreSQL**, um banco de dados relacional, devido às seguintes razões:

1. **Consistência e Integridade**: O PostgreSQL oferece suporte robusto a transações ACID, garantindo a consistência dos dados.
2. **Relacionamentos Complexos**: O sistema requer relacionamentos entre entidades como membros, projetos, clientes e orçamentos, que são bem suportados por bancos relacionais.
3. **Escalabilidade**: O PostgreSQL é altamente escalável, suportando grandes volumes de dados e consultas complexas.
4. **Comunidade e Suporte**: Possui uma ampla comunidade e documentação, facilitando a resolução de problemas e a implementação de novas funcionalidades.

## Exemplos de Uso da API

### 1. Cadastro de Membros
**Endpoint**: `POST /member`  
**Exemplo de Requisição**:
```json
{
  "name": "John Doe",
  "email": "john.doe@compjunior.com.br",
  "role": "member",
  "phone": "123456789",
  "gender": "male",
  "skills": ["JavaScript", "TypeScript"]
}
```
**Resposta**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@compjunior.com.br",
  "role": "member",
  "phone": "123456789",
  "gender": "male",
  "skills": ["JavaScript", "TypeScript"]
}
```

---

### 2. Gerenciamento de Penalidades
**Endpoint**: `POST /penalty`  
**Exemplo de Requisição**:
```json
{
  "type": "warning",
  "reason": "Atraso no projeto",
  "date": "2023-10-01",
  "memberId": 1
}
```
**Resposta**:
```json
{
  "id": 1,
  "type": "warning",
  "reason": "Atraso no projeto",
  "date": "2023-10-01",
  "member": {
    "id": 1,
    "name": "John Doe"
  }
}
```

---

### 3. Check-in/Check-out de Equipamentos
**Check-out**  
**Endpoint**: `PUT /equipment/:id/check-out`  
**Exemplo de Requisição**:
```json
{
  "memberId": 1
}
```
**Resposta**:
```json
{
  "id": 1,
  "name": "Laptop",
  "checkedOutBy": {
    "id": 1,
    "name": "John Doe"
  }
}
```

**Check-in**  
**Endpoint**: `PUT /equipment/:id/check-in`  
**Resposta**:
```json
{
  "id": 1,
  "name": "Laptop",
  "checkedOutBy": null
}
```

---

### 4. Gerenciamento de Projetos
**Endpoint**: `POST /project`  
**Exemplo de Requisição**:
```json
{
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "status": "planning",
  "leaderId": 1,
  "budgetId": 1
}
```
**Resposta**:
```json
{
  "id": 1,
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "status": "planning",
  "leader": {
    "id": 1,
    "name": "John Doe"
  },
  "budget": {
    "id": 1,
    "title": "Orçamento Inicial"
  }
}
```

---

### 5. Recuperação de Senha
**Endpoint**: `POST /auth/reset-password/:token`  
**Exemplo de Requisição**:
```json
{
  "password": "newpassword123"
}
```
**Exemplo de Resposta**:
```json
{
  "message": "Password reset successfully"
}
```

## ✍🏻 Autor

| [<img src="https://avatars.githubusercontent.com/u/91806052?v=4" width=115><br><sub>João Pedro Oliveira</sub>](https://github.com/torrescf) |
| :---: |
