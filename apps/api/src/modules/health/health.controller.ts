import { Controller, Get, Inject } from '@nestjs/common';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import type { Schema } from 'src/common/types/db';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  @Get()
  async check() {
    try {
      // Test database connection with a simple query
      await this.db.execute('SELECT 1 as health_check');
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        message: 'All systems operational'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
        message: 'Database connection failed'
      };
    }
  }

  @Get('db')
  async checkDatabase() {
    try {
      // Test database connection with a simple query
      await this.db.execute('SELECT 1 as health_check');
      
      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        status: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error.message,
        message: 'Database connection failed'
      };
    }
  }
}
