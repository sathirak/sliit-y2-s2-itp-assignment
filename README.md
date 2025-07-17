# Crown Up Monorepo

This is a monorepo for a full-stack project using pnpm, Turborepo, TypeScript, Vite (React), Express, and MongoDB.

## Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v9+ recommended)

## Getting Started

### 1. Install Dependencies

```sh
pnpm install
```

### 3. Start Development Servers

Run both frontend and backend in development mode:

```sh
pnpm dev:frontend #To develop only the frontend

pnpm dev #To develop both
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: Usually [http://localhost:3001](http://localhost:3001) (check your API config)

## Project Structure

- `apps/api` — Express + Mongoose backend
- `apps/frontend` — React + Vite + Tailwind frontend