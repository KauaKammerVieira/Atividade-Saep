# SAEPSaúde

Sistema SPA para cadastro e listagem de atividades físicas, login, curtidas, comentários, filtros e paginação.

## Stack

- Frontend: React + Vite + Axios + React Router + Lucide React
- Backend: Node.js + Express
- Banco: PostgreSQL + Sequelize
- Segurança: Helmet + CORS + bcryptjs + JWT + express-rate-limit
- Validação: Zod

## 1. Banco

Crie um banco PostgreSQL chamado `saepsaude`.

## 2. Backend

Entre em `backend`, copie `.env.example` para `.env` e ajuste os dados do PostgreSQL.

Depois:

```bash
npm install
npm run seed
npm run dev
```

API: `http://localhost:3000`

## 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## 4. Projeto inteiro

Na raiz:

```bash
npm install
npm run install:all
npm run dev
```

## 5. Importação dos CSVs

Coloque os arquivos do protótipo em:

- `backend/data/usuarios.csv`
- `backend/data/atividades.csv`

Depois execute:

```bash
npm run import:csv
```

O importador aceita nomes de colunas comuns em português e inglês. Consulte `backend/scripts/importCsv.js` para ajustar algum nome específico do seu CSV.

## Usuário de teste

Depois do seed:

- e-mail: `usuario03@saepsaude.com`
- senha: `123456`

O seed cria também usuários de exemplo e atividades.

## Assets

Coloque os arquivos reais do caderno em:

`frontend/public/assets/`

Nomes esperados:

- `SAEPSaude.png`
- `Instagram.svg`
- `Twitter.svg`
- `TikTok.svg`

Os ícones de interação são feitos com Lucide React, então não dependem dos SVGs externos.
