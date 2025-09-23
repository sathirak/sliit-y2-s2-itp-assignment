import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { TicketStatus } from '../interfaces/tickets';

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default(TicketStatus.OPEN).$type<TicketStatus>(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
}).enableRLS();
