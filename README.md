pnpm dev #To develop both

# Crown Up Monorepo

This is a monorepo for a clothing store e-commerce platform built with TypeScript, Turborepo, pnpm workspaces, NestJS, Next.js, and PostgreSQL/Drizzle ORM.

## Architecture Overview

- **Backend**: NestJS API (`apps/api`) with PostgreSQL and Drizzle ORM
- **Frontend**: Next.js 15 with App Router (`apps/frontend`)
- **Build System**: Turborepo + pnpm workspaces
- **Auth**: Supabase authentication with custom JWT handling
- **Database**: PostgreSQL (Drizzle ORM)

### Key Domains
- Users
- Products
- Orders
- Tickets
- Contracts

## Project Structure

```
apps/
	api/        # NestJS backend (modules, models, services, controllers)
	frontend/   # Next.js frontend (App Router, UI, hooks, services)
```

## Development Workflow

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v9+ recommended)

### Install Dependencies
```sh
pnpm install
```

### Start Development Servers
```sh
pnpm dev          # Both frontend + API
pnpm dev:frontend # Frontend only (Next.js on :3000)
pnpm dev:api      # API only (NestJS on :3001)
```

### Database Operations
```sh
pnpm --filter api d generate  # Generate migrations
pnpm --filter api d migrate   # Run migrations
```

### Environment Setup
- PostgreSQL: `docker-compose -f docker-compose-postgres.yml up -d`
- PgAdmin available at localhost:8080 (admin@admin.com/admin)

## Backend Patterns

- **Module Structure**: Each domain in `apps/api/src/modules/{domain}/` has its own module, service, controller, models, and DTOs.
- **Database Injection**: Use `@Inject(DatabaseAsyncProvider)` and type `Schema` from `src/common/types/db`.
- **Drizzle ORM**: All models exported via `src/database/schema.ts`. Use `db.query.{tableName}.findMany()` for queries.
- **Relations**: Defined separately (e.g., `usersRelations`).
- **Global Auth**: JWT guard applied globally in `app.module.ts`.

## Frontend Patterns

- **API Clients**: `apiPublicClient` (no auth) and `apiPrivateClient` (injects Supabase JWT).
- **Data Fetching**: SWR for client-side data fetching, caching, and synchronization.
- **Services**: Type-safe service functions in `lib/services/` matching API endpoints.
- **DTOs**: Shared types in `lib/dtos/` mirror backend DTOs.
- **Hooks**: Custom SWR hooks in `lib/hooks/` for data fetching and mutations.
- **UI Components**: Use shadcn/ui components from `apps/frontend/modules/ui/`. For icons, use lucide-react.

## Authentication Flow
1. Supabase handles auth on frontend
2. JWT token auto-injected via `apiPrivateClient` hooks
3. Backend `JwtGuard` validates tokens globally
4. `UserService.getUserBySupabaseId()` maps Supabase users to local user records

## SWR Data Management
- Caching and deduplication
- Optimistic updates and cache revalidation
- Error and loading state handling
- Mutations always call `mutate()` to keep cache fresh

## Build & Deployment Notes
- Turbo handles parallel builds across apps
- Next.js uses Turbopack for faster dev builds
- Database migrations auto-run via Docker init scripts
- Biome (not ESLint) used for frontend linting

## Anti-Patterns to Avoid
- Do not use MongoDB patterns (this is PostgreSQL)
- Do not bypass the service layer authentication flow
- Do not create models outside the established module structure
- Do not use direct database queries without the Schema type