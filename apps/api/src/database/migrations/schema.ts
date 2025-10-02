import { pgTable, uuid, text, timestamp, boolean, unique, foreignKey, numeric, integer, index, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const tickets = pgTable("tickets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
	phone: text().notNull(),
	message: text().notNull(),
	status: text().default('OPEN').notNull(),
	notes: text(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	roleName: text("role_name").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const contracts = pgTable("contracts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	amount: text().notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	ownerId: uuid("owner_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "contracts_owner_id_users_id_fk"
		}),
]);

export const contractRequest = pgTable("contract_request", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	amount: text().notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	status: text().default('pending').notNull(),
	ownerId: uuid("owner_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	ownerApproved: boolean("owner_approved").default(false).notNull(),
	ownerApprovedAt: timestamp("owner_approved_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
	comment: text(),
	isPaid: boolean("is_paid").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "contract_request_owner_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [users.id],
			name: "contract_request_supplier_id_users_id_fk"
		}),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	status: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
	customerId: uuid("customer_id"),
}, (table) => [
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [users.id],
			name: "orders_customer_id_users_id_fk"
		}),
]);

export const invoices = pgTable("invoices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	issuedAt: timestamp("issued_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }),
	status: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "invoices_order_id_orders_id_fk"
		}),
]);

export const orderProducts = pgTable("order_products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productId: uuid("product_id").notNull(),
	quantity: integer().default(1).notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_products_order_id_orders_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_products_product_id_products_id_fk"
		}),
]);

export const products = pgTable("products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	category: text().notNull(),
	description: text().notNull(),
	size: text().notNull(),
	color: text().notNull(),
	qty: integer().notNull(),
	price: text().notNull(),
	productImage: text("product_image").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleted: boolean().default(false).notNull(),
});

export const payments = pgTable("payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	invoiceId: uuid("invoice_id").notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	method: text().notNull(),
	status: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.invoiceId],
			foreignColumns: [invoices.id],
			name: "payments_invoice_id_invoices_id_fk"
		}),
]);

export const userProviders = pgTable("user_providers", {
	providerId: uuid("provider_id").notNull(),
	userId: uuid("user_id").notNull(),
	provider: text(),
}, (table) => [
	index("user_providers_provider_id_idx").using("btree", table.providerId.asc().nullsLast().op("uuid_ops")),
	index("user_providers_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_providers_user_id_users_id_fk"
		}),
	primaryKey({ columns: [table.providerId, table.userId], name: "user_providers_provider_id_user_id_pk"}),
]);
