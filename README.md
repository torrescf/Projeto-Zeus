# ⚡ Projeto Zeus

Sistema backend desenvolvido com foco em organização, escalabilidade e boas práticas de desenvolvimento. O Projeto Zeus é uma API construída em **Node.js** com **TypeScript**, utilizando **PostgreSQL** para persistência de dados, **Docker** para padronização do ambiente, e **Insomnia** para testes de rota.

---

## 🚀 Tecnologias Utilizadas

### 🟦 TypeScript
Escolhido por oferecer tipagem estática, melhorando a segurança do código, a experiência de desenvolvimento e a escalabilidade de projetos maiores.

### 🟩 Node.js
Tecnologia de runtime que permite utilizar JavaScript/TypeScript no backend, com alta performance e uma vasta comunidade. Ideal para aplicações modernas, leves e escaláveis.

### 🐘 PostgreSQL
Banco de dados relacional confiável, open source e robusto. Oferece grande compatibilidade com SQL padrão e é amplamente usado em produção.

### 🔶 TypeORM
ORM (Object-Relational Mapper) utilizado para abstrair a camada de banco de dados, permitindo interações orientadas a objetos com o PostgreSQL.

### 🐳 Docker
Ferramenta de containerização usada para garantir que o ambiente de desenvolvimento seja idêntico em qualquer máquina. Evita problemas como "funciona na minha máquina".

### 🧪 Insomnia
Cliente de API usado para testar os endpoints da aplicação de forma prática e organizada durante o desenvolvimento.

### 🧰 Outros
- Git & GitHub: controle de versão e hospedagem do repositório
- Visual Studio Code & Visual Studio: editores/IDEs utilizados no projeto

---

## 📌 Funcionalidades Principais

- ✅ CRUD completo de entidades
- 📁 Organização modular (controllers, services, routes, entities)
- 🗃️ Integração com banco de dados relacional via TypeORM
- 🔐 Preparado para autenticação e autorização (em desenvolvimento)
- 🧪 Testes manuais com Insomnia
- 🧱 Estrutura pronta para escalabilidade e novas funcionalidades
- 🐳 Ambiente containerizado com Docker (em progresso/planejado)

---

## 📂 Estrutura de Diretórios
src/ ├── config/ # Configurações de conexão, ambiente, etc.
     ├── controllers/ # Controladores das rotas 
     ├── entities/ # Entidades do banco (TypeORM) 
     ├── routes/ # Definição das rotas da API 
     ├── services/ # Lógica de negócio 
     ├── database/ # Migrations e conexões com o banco 
     └── index.ts # Ponto de entrada da aplicação


---

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- PostgreSQL rodando localmente ou em container
- Docker (opcional, para futura integração)

### Passos:

### 1. Clone o repositório:
```bash
git clone https://github.com/torrescf/Projeto-Zeus.git
cd Projeto-Zeus
```
### 2. Instale as dependências:

npm install

### 3. Configure seu banco PostgreSQL e crie um arquivo .env com o seguinte formato:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=zeus_db
```
### 4. Rode as migrations (se aplicável):
```bash
npm run typeorm migration:run
```
# 5. Inicie a aplicação em modo desenvolvimento:
```bash
npm run dev
```
# 6. Teste os endpoints com o Insomnia ou outro cliente REST.
