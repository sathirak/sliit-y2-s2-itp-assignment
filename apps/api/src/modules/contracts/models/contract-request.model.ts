import { boolean, pgTable, text, timestamp, uuid, decimal, date } from 'drizzle-orm/pg-core';
import { usersTable } from '../../users/models/user.model';
import { relations } from 'drizzle-orm';

export const contractRequests = pgTable('contract_request', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  amount: text('amount').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').notNull().default('pending'), // pending, ongoing, completed, rejected
  comment: text('comment'),
  isPaid: boolean('is_paid').notNull().default(false),
  ownerId: uuid('owner_id').notNull().references(() => usersTable.id),
  supplierId: uuid('supplier_id').notNull().references(() => usersTable.id),
  ownerApproved: boolean('owner_approved').notNull().default(false),
  ownerApprovedAt: timestamp('owner_approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
}).enableRLS();

// Relations
export const contractRequestsRelations = relations(contractRequests, ({ one }) => ({
  owner: one(usersTable, {
    fields: [contractRequests.ownerId],
    references: [usersTable.id],
  }),
  supplier: one(usersTable, {
    fields: [contractRequests.supplierId],
    references: [usersTable.id],
  }),
}));
