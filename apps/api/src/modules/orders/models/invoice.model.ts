import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './order.model';
import { payments } from './payment.model';
import type { InvoiceStatus } from '../interfaces/invoice-status';

export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').notNull().references(() => orders.id), // FK to orders
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
    dueDate: timestamp('due_date', { withTimezone: true }),
    status: text('status').notNull().$type<InvoiceStatus>(),
}).enableRLS();

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    order: one(orders, {
        fields: [invoices.orderId],
        references: [orders.id],
    }),
    payments: many(payments),
}));
