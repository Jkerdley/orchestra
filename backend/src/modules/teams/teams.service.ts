import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/drizzle.service';
import { teams, users } from '../../db/schema';

@Injectable()
export class TeamsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    return this.drizzle.db.select().from(teams);
  }

  async findOne(id: number) {
    const [team] = await this.drizzle.db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .limit(1);

    if (!team) {
      throw new NotFoundException(`Team #${id} not found`);
    }

    return team;
  }

  async findMembers(id: number) {
    await this.findOne(id);

    return this.drizzle.db.select().from(users).where(eq(users.teamId, id));
  }
}
