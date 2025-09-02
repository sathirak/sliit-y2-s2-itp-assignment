import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { invoices } from './invoice.model';
import type { PaymentMethod } from '../interfaces/payment-method';
import type { PaymentStatus } from '../interfaces/payment-status';

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id), // FK to invoices
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }).notNull().defaultNow(),
    method: text('method').notNull().$type<PaymentMethod>(),
    status: text('status').notNull().$type<PaymentStatus>(),
}).enableRLS();

export const paymentsRelations = relations(payments, ({ one }) => ({
    invoice: one(invoices, {
        fields: [payments.invoiceId],
        references: [invoices.id],
    }),
}));
