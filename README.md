💻 Projeto Zeus
Sistema interno para a Comp Júnior com o objetivo de gerenciar usuários, orçamentos, membros e demais recursos organizacionais.

Este backend foi desenvolvido como parte do desafio da trilha de especialização da Comp Júnior 2025.1, utilizando tecnologias modernas e seguindo boas práticas de desenvolvimento.

🚀 Funcionalidades
Cadastro e login de usuários

Criação, leitura, atualização e exclusão de orçamentos

Relacionamento entre entidades (ex: um usuário pode ser responsável por vários orçamentos)

API RESTful com rotas organizadas

Testes de endpoints via Insomnia

🧱 Tecnologias Utilizadas

Tecnologia	Justificativa
Node.js	Plataforma robusta e escalável para desenvolvimento backend.
TypeScript	Tipagem estática, prevenção de erros em tempo de desenvolvimento.
Express.js	Framework minimalista e eficiente para construção de APIs RESTful.
MySQL	Banco de dados relacional ideal para lidar com entidades conectadas.
Docker	Containerização do projeto, garantindo portabilidade e facilidade no deploy.
Insomnia	Ferramenta prática para testar e documentar os endpoints da API.
🧩 Estrutura do Projeto
bash
Copiar
Editar
zeus/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── database/
├── docker-compose.yml
├── .env
├── README.md
└── ...
🐳 Como executar com Docker
bash
Copiar
Editar
# Clone o repositório
git clone https://github.com/seu-usuario/zeus.git
cd zeus

# Crie o arquivo .env com suas variáveis
cp .env.example .env

# Suba os containers
docker-compose up --build
A API estará disponível em http://localhost:3000 (ou porta definida no seu .env)
