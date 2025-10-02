import { relations } from "drizzle-orm/relations";
import { users, contracts, contractRequest, orders, invoices, orderProducts, products, payments, userProviders } from "./schema";

export const contractsRelations = relations(contracts, ({one}) => ({
	user: one(users, {
		fields: [contracts.ownerId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	contracts: many(contracts),
	contractRequests_ownerId: many(contractRequest, {
		relationName: "contractRequest_ownerId_users_id"
	}),
	contractRequests_supplierId: many(contractRequest, {
		relationName: "contractRequest_supplierId_users_id"
	}),
	orders: many(orders),
	userProviders: many(userProviders),
}));

export const contractRequestRelations = relations(contractRequest, ({one}) => ({
	user_ownerId: one(users, {
		fields: [contractRequest.ownerId],
		references: [users.id],
		relationName: "contractRequest_ownerId_users_id"
	}),
	user_supplierId: one(users, {
		fields: [contractRequest.supplierId],
		references: [users.id],
		relationName: "contractRequest_supplierId_users_id"
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.customerId],
		references: [users.id]
	}),
	invoices: many(invoices),
	orderProducts: many(orderProducts),
}));

export const invoicesRelations = relations(invoices, ({one, many}) => ({
	order: one(orders, {
		fields: [invoices.orderId],
		references: [orders.id]
	}),
	payments: many(payments),
}));

export const orderProductsRelations = relations(orderProducts, ({one}) => ({
	order: one(orders, {
		fields: [orderProducts.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderProducts.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	orderProducts: many(orderProducts),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	invoice: one(invoices, {
		fields: [payments.invoiceId],
		references: [invoices.id]
	}),
}));

export const userProvidersRelations = relations(userProviders, ({one}) => ({
	user: one(users, {
		fields: [userProviders.userId],
		references: [users.id]
	}),
}));