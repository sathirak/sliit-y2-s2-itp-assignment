import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from '../../users/models/user.model';
import { contractRequests } from './contract-request.model';
import { relations } from 'drizzle-orm';

export const contractRequestComments = pgTable('contract_request_comment', {
  id: uuid('id').defaultRandom().primaryKey(),
  comment: text('comment').notNull(),
  contractRequestId: uuid('contract_request_id').notNull().references(() => contractRequests.id),
  userId: uuid('user_id').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

// Relations
export const contractRequestCommentsRelations = relations(contractRequestComments, ({ one }) => ({
  contractRequest: one(contractRequests, {
    fields: [contractRequestComments.contractRequestId],
    references: [contractRequests.id],
  }),
  user: one(usersTable, {
    fields: [contractRequestComments.userId],
    references: [usersTable.id],
  }),
}));
