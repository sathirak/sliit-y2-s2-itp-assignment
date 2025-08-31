import { relations } from 'drizzle-orm';
import { index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from 'src/database/schema';

export const userProviders = pgTable(
  'user_providers',
  {
    providerId: uuid('provider_id'),
    userId: uuid('user_id').references(() => usersTable.id),
    provider: text('provider'),
  },
  (table) => [
    primaryKey({ columns: [table.providerId, table.userId] }),
    index('user_providers_user_id_idx').on(table.userId),
    index('user_providers_provider_id_idx').on(table.providerId),
  ],
).enableRLS();

export const userProvidersRelations = relations(userProviders, ({ one }) => ({
  user: one(usersTable, {
    fields: [userProviders.userId],
    references: [usersTable.id],
  }),
}));
