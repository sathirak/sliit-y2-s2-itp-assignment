import { PgTransaction } from 'drizzle-orm/pg-core';
import * as schema from 'src/database/schema';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type Schema = NodePgDatabase<typeof schema>;
