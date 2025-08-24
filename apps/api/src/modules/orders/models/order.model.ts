import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { OrderStatus } from 'src/modules/orders/interfaces/order-status';
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    status: text('status').notNull().$type<OrderStatus>(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    isDeleted: boolean('deleted').notNull().default(false),
}).enableRLS(); 