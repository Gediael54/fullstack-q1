# 🚗 Sistema de Gerenciamento de Veículos

> Um sistema completo para gerenciamento de veículos construído com Next.js, TypeScript e PostgreSQL

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Configuração das Variáveis de Ambiente](#configuração-das-variáveis-de-ambiente)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Routes](#api-routes)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

Sistema web para gerenciamento de veículos que permite:
- Cadastro e autenticação de usuários
- Gerenciamento de veículos (CRUD completo)
- Controle de status dos veículos
- Interface responsiva e moderna

## 🚀 Tecnologias Utilizadas

- **Frontend/Backend:** [Next.js 14](https://nextjs.org/) com App Router
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Autenticação:** JWT (JSON Web Tokens)
- **Fonte:** [Geist Font](https://vercel.com/font)

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 12 ou superior)
- [Git](https://git-scm.com/)
- Um gerenciador de pacotes: [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) ou [bun](https://bun.sh/)

## 💻 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/fullstack-q1.git
cd fullstack-q1
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

## 🗄️ Configuração do Banco de Dados

### 1. Criação do Database

Execute os comandos SQL abaixo no seu cliente PostgreSQL (psql, pgAdmin, etc.):

```sql
-- Criar o database
CREATE DATABASE vehicle_management;

-- Conectar ao database
\c vehicle_management;
```

### 2. Criação das Tabelas

Execute o script SQL completo:

```sql
-- Criar a tabela users primeiro (referenciada por vehicles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar a tabela vehicles
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plate VARCHAR(10) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para otimização
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_users_email ON users(email);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 Configuração das Variáveis de Ambiente

1. **Crie um arquivo `.env.local` na raiz do projeto:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_management
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura


```

2. **Substitua os valores pelos seus dados:**
   - `seu_usuario`: seu usuário do PostgreSQL
   - `sua_senha`: sua senha do PostgreSQL
   - `sua_chave_secreta_jwt_muito_segura`: uma string aleatória e segura para JWT
   - `sua_chave_secreta_nextauth`: uma string aleatória e segura para NextAuth

## 🏃‍♂️ Como Executar

1. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

2. **Acesse a aplicação:**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

3. **Primeira execução:**
   - A aplicação estará rodando em modo de desenvolvimento
   - Você pode começar editando `app/page.tsx`
   - As mudanças são aplicadas automaticamente

## 📁 Estrutura do Projeto

```
vehicle-management/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   └── vehicles/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── forms/
├── lib/
│   ├── database.ts
│   └── auth.ts
├── models/
│   ├── User.ts
│   └── Vehicle.ts
├── types/
│   └── index.ts
├── middleware.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔌 API Routes

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Cadastro de usuário

### Veículos
- `GET /api/vehicles` - Listar veículos do usuário
- `POST /api/vehicles` - Criar novo veículo
- `PUT /api/vehicles/[id]` - Atualizar veículo
- `DELETE /api/vehicles/[id]` - Deletar veículo

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🚀 Deploy

### Vercel (Recomendado)

A forma mais fácil de fazer deploy é usando a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Faça push do seu código para o GitHub
2. Conecte seu repositório na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras Plataformas

- **Railway:** Suporte nativo ao PostgreSQL
- **Heroku:** Com add-on do PostgreSQL
- **AWS:** EC2 + RDS
- **DigitalOcean:** App Platform

## 📚 Recursos Adicionais

Para aprender mais sobre Next.js:

- [Documentação do Next.js](https://nextjs.org/docs) - recursos e API do Next.js
- [Tutorial Interativo](https://nextjs.org/learn) - tutorial interativo do Next.js
- [Repositório no GitHub](https://github.com/vercel/next.js) - feedback e contribuições são bem-vindos!

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Feito com ❤️ por [Seu Nome](https://github.com/seu-usuario)

---

⭐ Se este projeto te ajudou, considera dar uma estrela no repositório!