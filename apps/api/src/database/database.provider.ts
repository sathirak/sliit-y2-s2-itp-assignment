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
      const logger = new Logger('DatabaseProvider');
      const dbConnectionString = configService.get<string>('DATABASE_URL');
      
      if (!dbConnectionString) {
        logger.error('DATABASE_URL is not configured');
        throw new Error('DATABASE_URL is not configured');
      }

      logger.log('Attempting to connect to database...');
      
      const pool = new Pool({
        connectionString: dbConnectionString,
        ssl: process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: false }
          : false,
      });


      try {
        const client = await pool.connect();
        logger.log('✅ Database connection successful');
        client.release();
      } catch (error) {
        logger.error('❌ Database connection failed:', error.message);
        throw new Error(`Database connection failed: ${error.message}`);
      }

      const db = drizzle(pool, {
        schema,
        logger: new DatabaseLogger(),
      }) as Schema;

      logger.log('Database provider initialized successfully');
      return db;
    },
  },
];
