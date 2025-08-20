import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export const users: User[] = [];

export const usersTable = pgTable('users', {
  userId: uuid('user_id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleName: text('role_name').$type<'admin' | 'customer' | 'sales_rep' | 'supplier'>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    isDeleted: boolean('deleted').notNull().default(false)
  });