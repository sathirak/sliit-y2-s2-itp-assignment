import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const cats = pgTable('cats', {
  id: uuid('id').defaultRandom().primaryKey(),
  color: text('color').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean('deleted').notNull().default(false),
}).enableRLS();
