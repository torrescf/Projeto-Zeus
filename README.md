# ⚡ Projeto Zeus

## 📚 Descrição do produto

O Projeto Zeus é um sistema backend desenvolvido para gerenciar membros, clientes, projetos, orçamentos e penalidades. Ele oferece uma API robusta e escalável, construída com **Node.js** e **TypeScript**, utilizando **PostgreSQL** como banco de dados. O sistema conta com autenticação JWT, integração com serviços de e-mail e suporte a múltiplos papéis de usuário, como administradores, membros e estagiários.
O Projeto Zeus é um sistema backend desenvolvido para gerenciar membros, clientes, projetos, orçamentos e penalidades. Ele oferece uma API robusta e escalável, construída com **Node.js** e **TypeScript**, utilizando **PostgreSQL** como banco de dados. O sistema conta com autenticação JWT, integração com serviços de e-mail e suporte a múltiplos papéis de usuário, como administradores e membros.

---

## 💻 Tecnologias utilizadas

- **Node.js** 18
- **TypeScript** 5.2
- **Express** 4.18
- **TypeORM** 0.3
- **PostgreSQL** 14
- **Nodemailer** 6.10
- **Docker** 3.8
- **Jest** 29.6 (para testes)
- **Insomnia** (para testes manuais de API)

---

## 🧑‍💻 Regras de código adotadas

- Uso do padrão **camelCase** para variáveis e funções.
- Funções devem seguir o princípio da **Single Responsibility**.
- Limitação de 25 linhas por função.
- Comentários explicativos obrigatórios para cada função.
- Aplicação do princípio **DRY** (Don't Repeat Yourself).
- Tratamento de erros padronizado em toda a aplicação.

---

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

---

## 🧑‍💻 Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/torrescf/Projeto-Zeus.git
   cd Projeto-Zeus
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as variáveis de ambiente necessárias:
   ```env
   DB_HOST=host_do_banco
   DB_PORT=porta_do_banco
   DB_USER=usuario_do_banco
   DB_PASSWORD=senha_do_banco
   DB_NAME=nome_do_banco
   JWT_SECRET=sua_chave_secreta
   EMAIL_USER=seu_email
   EMAIL_PASS=sua_senha
   ```

4. Inicie o banco de dados PostgreSQL e rode as migrations:
   ```bash
   npm run migration:run
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Acesse a interface web em:
   ```
   http://localhost:5000
   ```

7. Teste os endpoints utilizando o Insomnia ou outro cliente REST.

---

## 📁 Estrutura de pastas

```
├── src
│   ├── config/               # Configurações do banco de dados e ambiente
│   ├── controllers/          # Controladores das rotas
│   ├── entities/             # Entidades do banco de dados (TypeORM)
│   ├── middlewares/          # Middlewares de autenticação e validação
│   ├── routes/               # Definição das rotas da API
│   ├── services/             # Lógica de negócio
│   ├── index.ts              # Ponto de entrada da aplicação
│   └── tests/                # Testes automatizados
├── public/                   # Arquivos estáticos (HTML, CSS, JS)
├── .env                      # Variáveis de ambiente
├── package.json              # Dependências e scripts do projeto
├── tsconfig.json             # Configuração do TypeScript
└── README.md                 # Documentação do projeto
```

---

## ✍🏻 Autor

| [<img src="https://avatars.githubusercontent.com/u/91806052?v=4" width=115><br><sub>João Pedro Oliveira</sub>](https://github.com/torrescf) |
| :---: |