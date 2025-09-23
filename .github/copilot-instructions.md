# AI Coding Agent Instructions for Crown Up Monorepo

## Architecture Overview
This is a TypeScript monorepo for a clothing store e-commerce platform with:
- **Backend**: NestJS API (`apps/api`) with PostgreSQL/Drizzle ORM
- **Frontend**: Next.js 15 with App Router (`apps/frontend`) 
- **Build System**: Turborepo + pnpm workspaces
- **Auth**: Supabase authentication with custom JWT handling
- **Database**: PostgreSQL with Drizzle ORM (not MongoDB despite docker-compose.yml)

## Key Development Workflows

### Starting Development
```bash
pnpm dev          # Both frontend + API
pnpm dev:frontend # Frontend only (Next.js on :3000)
pnpm dev:api      # API only (NestJS on :3001)
```

### Database Operations
```bash
pnpm --filter api d generate  # Generate migrations
pnpm --filter api d migrate   # Run migrations
```

### Environment Setup
- PostgreSQL: `docker-compose -f docker-compose-postgres.yml up -d`
- PgAdmin available at localhost:8080 (admin@admin.com/admin)

## Project-Specific Patterns

### API Module Structure
Each domain module follows this pattern:
```
modules/{domain}/
├── {domain}.module.ts     # NestJS module with DatabaseModule import
├── {domain}.service.ts    # Business logic with db injection
├── {domain}.controller.ts # REST endpoints
├── models/
│   └── {domain}.model.ts  # Drizzle schema definitions
└── dtos/
    ├── create-{domain}.dto.ts
    ├── update-{domain}.dto.ts
    └── {domain}.dto.ts
```

**Critical**: Database injection uses `@Inject(DatabaseAsyncProvider)` and type `Schema` from `src/common/types/db`.

### Database Schema Management
- All models exported through `src/database/schema.ts`
- Drizzle config targets `./src/**/**.model.ts` files
- Use `db.query.{tableName}.findMany()` for queries, not raw SQL
- Relations defined separately (e.g., `usersRelations`)

### Frontend Architecture
- **Client Types**: `apiPublicClient` (no auth) vs `apiPrivateClient` (auto-injects Supabase JWT)
- **Data Fetching**: SWR for client-side data fetching, caching, and synchronization
- **Layout Structure**: `app/(main)/layout.tsx` includes Header/Footer, `app/admin/layout.tsx` for admin
- **Services Pattern**: Type-safe service functions in `lib/services/` matching API endpoints
- **DTOs**: Shared types in `lib/dtos/` mirror backend DTOs
- **Hooks Pattern**: Custom SWR hooks in `lib/hooks/` for data fetching and mutations

### Authentication Flow
1. Supabase handles auth on frontend
2. JWT token auto-injected via `apiPrivateClient` hooks
3. Backend `JwtGuard` validates tokens globally (APP_GUARD)
4. `UserService.getUserBySupabaseId()` maps Supabase users to local user records

## Critical Integration Points

### API Client Pattern
```typescript
// Public endpoints
import { apiPublicClient } from '@/lib/public';

// Authenticated endpoints  
import { apiPrivateClient } from '@/lib/private';
const result = await apiPrivateClient.get<UserDto>("user/me").json<UserDto>();
```

### SWR Data Fetching Pattern
```typescript
// Use custom SWR hooks for data fetching
import { useUsers, useUserMutations } from '@/lib/hooks/useUsers';

function MyComponent() {
  const { users, isLoading, isError } = useUsers();
  const { createUser, updateUser, deleteUser } = useUserMutations();
  
  // SWR handles caching, revalidation, and error states automatically
}
```

### Database Service Pattern
```typescript
@Injectable()
export class ExampleService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,  // NOT NodePgDatabase
  ) {}
}
```

### Module Dependencies
- Always import `DatabaseModule` in feature modules
- Export services that other modules need
- Global JWT guard applied via APP_GUARD in app.module.ts

## Domain Model Structure
Core business domains: users, products, orders, tickets, contracts

## Frontend UI Component Patterns

- Use **shadcn/ui** components from `apps/frontend/modules/ui/` for all common UI elements (e.g., `button.tsx`, `card.tsx`, `dialog.tsx`). Import and compose these instead of creating new base components.
- For icons, use **lucide-react**. Import icons directly from `lucide-react` and use as React components (e.g., `<ArrowRight />`).

Example:
```tsx
import { Button } from '@/modules/ui/button';
import { ArrowRight } from 'lucide-react';

<Button>
  Next <ArrowRight className="ml-2" />
</Button>
```

## SWR Data Management Patterns

### Creating SWR Hooks
Follow this pattern for creating domain-specific SWR hooks in `lib/hooks/`:

```typescript
// lib/hooks/useExample.ts
import useSWR, { mutate } from 'swr';
import { exampleService } from '@/lib/services/example';

const EXAMPLES_KEY = 'examples';
const EXAMPLE_KEY = (id: string) => `examples/${id}`;

export function useExamples() {
  const { data, error, isLoading } = useSWR(EXAMPLES_KEY, exampleService.getAll);
  return { examples: data || [], isLoading, isError: !!error };
}

export function useExampleMutations() {
  const createExample = async (data: CreateExampleDto) => {
    const newExample = await exampleService.create(data);
    mutate(EXAMPLES_KEY, (examples = []) => [newExample, ...examples], false);
    mutate(EXAMPLES_KEY); // Revalidate
    return newExample;
  };
  
  return { createExample };
}
```

### SWR Best Practices
- **Caching**: SWR automatically caches responses and deduplicates requests
- **Optimistic Updates**: Update cache immediately, then revalidate
- **Error Handling**: Use global error handling in SWRProvider
- **Loading States**: Always handle `isLoading` and `isError` states
- **Search with Debouncing**: Use useState + useEffect for debounced search queries
- **Mutations**: Always call `mutate()` after successful operations to keep cache fresh
## Build & Deployment Notes  
- Turbo handles parallel builds across apps
- Next.js uses Turbopack for faster dev builds
- Database migrations auto-run via Docker init scripts
- Biome (not ESLint) used for frontend linting

## Common Anti-Patterns to Avoid
- Don't use MongoDB patterns (this is PostgreSQL)
- Don't bypass the service layer authentication flow
- Don't create models outside the established module structure
- Don't use direct database queries without the Schema type
