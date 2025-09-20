import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { OrderStatus } from 'src/modules/orders/interfaces/order-status';
import { usersTable } from 'src/modules/users/models/user.model';
import { invoices } from './invoice.model';
import { orderProducts } from './order-product.model';

export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    status: text('status').notNull().$type<OrderStatus>(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    isDeleted: boolean('deleted').notNull().default(false),
    customerId: uuid('customer_id').references(() => usersTable.id), // FK to users table
}).enableRLS();

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(usersTable, {
        fields: [orders.customerId],
        references: [usersTable.id],
    }),
    invoices: many(invoices),
    orderProducts: many(orderProducts),
}));