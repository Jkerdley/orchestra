import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly logger = new Logger(DrizzleService.name);
  public readonly db: NodePgDatabase<typeof schema>;
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });

    this.logger.log('Drizzle database connection established');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database pool closed');
  }
}