import { integer, numeric, pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './order.model';
import { products } from 'src/modules/products/models/product.model';

export const orderProducts = pgTable('order_products', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').notNull().references(() => orders.id), // FK to orders
    productId: uuid('product_id').notNull().references(() => products.id), // FK to products
    quantity: integer('quantity').notNull().default(1),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(), // price per unit
}).enableRLS();

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
    order: one(orders, {
        fields: [orderProducts.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderProducts.productId],
        references: [products.id],
    }),
}));
