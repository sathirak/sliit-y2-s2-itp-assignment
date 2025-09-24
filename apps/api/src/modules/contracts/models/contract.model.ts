import { boolean, pgTable, text, timestamp, uuid, decimal, date } from 'drizzle-orm/pg-core';
import { usersTable } from '../../users/models/user.model';
import { relations } from 'drizzle-orm';

export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  amount: text('amount').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  ownerId: uuid('owner_id').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
}).enableRLS();

// Relations
export const contractsRelations = relations(contracts, ({ one }) => ({
  owner: one(usersTable, {
    fields: [contracts.ownerId],
    references: [usersTable.id],
  }),
}));
