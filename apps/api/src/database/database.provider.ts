import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'src/database/schema';
import { ConfigService } from '@nestjs/config';
import { Schema } from 'src/common/types/db';
import { Logger } from '@nestjs/common';

export const DatabaseAsyncProvider = 'DatabaseAsyncProvider';

class DatabaseLogger {
  constructor(
    private readonly logger: Logger = new Logger(DatabaseLogger.name),
  ) {}
  public logQuery(_query: string, _?: unknown[]): void {
    return;
  }
}

export const databaseProvider = [
  {
    provide: DatabaseAsyncProvider,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbConnectionString = configService.get<string>('DATABASE_URL');
      const pool = new Pool({
        connectionString: dbConnectionString,
        ssl: { rejectUnauthorized: false },
      });

      return drizzle(pool, {
        schema,
        logger: new DatabaseLogger(),
      }) as Schema;
    },
  },
];
