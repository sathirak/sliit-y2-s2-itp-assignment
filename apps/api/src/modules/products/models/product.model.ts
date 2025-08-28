import { boolean, pgTable, text, timestamp, uuid, integer, decimal } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  size: text('size').notNull(),
  color: text('color').notNull(),
  qty: integer('qty').notNull(),
  price: text('price').notNull(),
  product_image: text('product_image').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
}).enableRLS();
