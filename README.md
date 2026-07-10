# Controle de Gastos Residenciais

Sistema web para controle de gastos residenciais, permitindo o cadastro de pessoas, registro de transações financeiras (receitas e despesas) e consulta de totais por pessoa e gerais.

## Tecnologias Utilizadas

### Backend
- **C#** com **ASP.NET Core 8** (Web API)
- **MongoDB Atlas** (banco de dados em nuvem) via `MongoDB.Driver`
- Arquitetura em camadas simples: Controller → Service → Repository

### Frontend
- **React** com **TypeScript**
- **Vite**
- **Axios**

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) instalado
- [Node.js 18+](https://nodejs.org/) instalado
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) com um cluster criado

## Como Configurar e Rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/gustavopinto244/desafio-maxiprod.git
cd sistema-controle-gastos
```

### 2. Configurar o MongoDB Atlas

1. Acesse o [MongoDB Atlas](https://cloud.mongodb.com/) e crie um cluster gratuito (se ainda não tiver).
2. No cluster, crie um banco de dados chamado `controle-gastos`.
3. Obtenha a connection string do cluster (em "Connect" → "Connect your application").
4. No projeto backend, crie o arquivo `backend/appsettings.Development.json` com o seguinte conteúdo:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "MongoDB": {
    "ConnectionString": "mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/?retryWrites=true&w=majority",
    "DatabaseName": "controle-gastos"
  }
}
```

> Substitua `USUARIO` e `SENHA` pelas suas credenciais do Atlas. Esse arquivo está no `.gitignore` e não será commitado.

> **settings.json** pode servir como template para **appsettings.Development.json**.

### 3. Rodar o Backend

```bash
cd backend
dotnet run
```

O backend vai rodar em `http://localhost:5000` (ou na porta indicada no console).

### 4. Rodar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend vai rodar em `http://localhost:5173` (porta padrão do Vite).

Acesse o endereço no navegador para usar o sistema.

## Dados de Exemplo (Seed)

Para popular o banco com dados de exemplo (3 pessoas e algumas transações), existem duas formas:

### Pela interface
Na aba "Pessoas", clique no botão **"Popular dados de exemplo"**.

Isso vai criar:
- **Maria Silva** (35 anos) — com receitas e despesas
- **João Santos** (28 anos) — com receitas e despesas
- **Ana Oliveira** (15 anos) — apenas com despesas (menor de idade)

## Endpoints da API

### Pessoas
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/pessoas` | Criar uma nova pessoa |
| GET | `/api/pessoas` | Listar todas as pessoas |
| GET | `/api/pessoas/{id}` | Buscar pessoa por ID |
| DELETE | `/api/pessoas/{id}` | Excluir pessoa (e suas transações) |

### Transações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/transacoes` | Criar uma nova transação |
| GET | `/api/transacoes` | Listar todas as transações |
| GET | `/api/transacoes/totais` | Consulta de totais por pessoa e geral |

### Seed
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/seed` | Popular banco com dados de exemplo |

## Regras de Negócio

- **Menores de 18 anos** só podem ter transações do tipo **Despesa**. Tentativas de cadastrar Receita para menores serão rejeitadas.
- Ao **excluir uma pessoa**, todas as suas transações são removidas automaticamente (cascade delete).
- O **PessoaId** de uma transação deve referenciar uma pessoa existente.
- Todos os campos obrigatórios são validados tanto no frontend quanto no backend.

## Fluxo de Requisição

O sistema segue uma arquitetura em camadas tanto no frontend quanto no backend. Segue o caminho completo que uma requisição percorre desde o clique do usuário até o banco de dados:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. Componente (Page)                                               │
│     - Usuário clica em botão ou submete formulário                  │
│     - Chama função do service layer                                 │
│     - Ex: PessoasPage.tsx → pessoaService.criarPessoa(dto)          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. Service Layer (frontend/src/services/)                          │
│     - Centraliza chamadas à API                                     │
│     - Componentes NUNCA chamam axios/fetch diretamente              │
│     - Ex: pessoaService.ts → api.post('/pessoas', dto)              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. API Client (Axios)                                              │
│     - Instância configurada com baseURL: http://localhost:5000/api  │
│     - Envia requisição HTTP (GET, POST, DELETE, etc)                │
│     - Ex: POST http://localhost:5000/api/pessoas                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Request
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (ASP.NET Core)                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. Controller (Controllers/PessoasController.cs)                   │
│     - Recebe requisição HTTP                                        │
│     - Valida ModelState (dados do DTO)                              │
│     - Delega para Service layer                                     │
│     - Retorna resposta HTTP (200, 201, 400, 404, 500)               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. Service (Services/PessoaService.cs)                             │
│     - Contém lógica de negócio                                      │
│     - Validações específicas (ex: menor de idade só pode despesa)   │
│     - Regras como cascade delete                                    │
│     - Chama Repository para persistir dados                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. Repository (Repositories/PessoaRepository.cs)                   │
│     - Acesso direto ao MongoDB                                      │
│     - Operações CRUD (Create, Read, Update, Delete)                 │
│     - Usa MongoDB.Driver para executar queries                      │
│     - Ex: _collection.InsertOneAsync(pessoa)                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MongoDB Driver
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS (Cloud)                          │
│                                                                     │
│  Database: controle-gastos                                          │
│  Collections:                                                       │
│    - pessoas (documentos com _id, nome, idade)                      │
│    - transacoes (documentos com _id, descricao, valor, tipo, etc)   │
└─────────────────────────────────────────────────────────────────────┘
```


## Estrutura do Projeto

```
├── Backend/                     # Backend ASP.NET Core
│   ├── Controllers/             # Endpoints REST
│   ├── Services/                # Lógica de negócio
│   ├── Repositories/            # Acesso ao MongoDB
│   ├── Models/                  # Entidades (Pessoa, Transacao)
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Enums/                   # Enums (TipoTransacao)
│   ├── Configurations/          # Classes de configuração
│   └── Program.cs               # Configuração da aplicação
├── frontend/                    # Frontend React + TypeScript
│   └── src/
│       ├── components/          # Componentes reutilizáveis
│       ├── pages/               # Páginas do sistema
│       ├── services/            # Camada de acesso à API
│       ├── types/               # Tipos TypeScript
│       └── styles/              # Estilos CSS
└── README.md
```
