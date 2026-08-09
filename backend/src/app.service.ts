import { Injectable } from '@nestjs/common';
import { DrizzleService } from './db/drizzle.service';
import { users } from './db/schema';

@Injectable()
export class AppService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUsers() {
    return this.drizzle.db.select().from(users);
  }
}