import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
description: text('description').notNull(),
createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean('deleted').notNull().default(false),
}).enableRLS();