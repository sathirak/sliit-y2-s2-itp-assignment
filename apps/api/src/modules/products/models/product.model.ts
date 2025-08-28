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
  productImage: text('product_image').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean('deleted').notNull().default(false),
}).enableRLS();
