import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UserRole } from '../interfaces/roles.enum';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleName: text('role_name')
    .$type<UserRole>()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean('deleted').notNull().default(false),
});
