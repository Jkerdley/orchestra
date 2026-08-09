import { Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, SQL } from 'drizzle-orm';
import { DrizzleService } from '../../db/drizzle.service';
import { tasks } from '../../db/schema';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(query: TaskQueryDto) {
    const filters: SQL[] = [];

    if (query.teamId !== undefined) {
      filters.push(eq(tasks.teamId, query.teamId));
    }

    if (query.assigneeId !== undefined) {
      filters.push(eq(tasks.assigneeId, query.assigneeId));
    }

    if (query.boardType !== undefined) {
      filters.push(eq(tasks.boardType, query.boardType));
    }

    if (query.status !== undefined) {
      filters.push(eq(tasks.status, query.status));
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    return this.drizzle.db
      .select()
      .from(tasks)
      .where(whereClause)
      .orderBy(asc(tasks.status), asc(tasks.sortOrder), asc(tasks.id));
  }

  async findOne(id: number) {
    const [task] = await this.drizzle.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async create(dto: CreateTaskDto) {
    const [created] = await this.drizzle.db
      .insert(tasks)
      .values({
        title: dto.title,
        description: dto.description,
        status: dto.status,
        epic: dto.epic,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        loggedMinutes: dto.loggedMinutes,
        sortOrder: dto.sortOrder,
        boardType: dto.boardType,
        assigneeId: dto.assigneeId,
        teamId: dto.teamId,
      })
      .returning();

    return created;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);

    const [updated] = await this.drizzle.db
      .update(tasks)
      .set({
        ...dto,
        dueDate:
          dto.dueDate === undefined
            ? undefined
            : dto.dueDate
              ? new Date(dto.dueDate)
              : null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updated;
  }

  async updateStatus(id: number, dto: UpdateTaskStatusDto) {
    await this.findOne(id);

    const [updated] = await this.drizzle.db
      .update(tasks)
      .set({
        status: dto.status,
        sortOrder: dto.sortOrder ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updated;
  }

  async assign(id: number, dto: AssignTaskDto) {
    await this.findOne(id);

    const [updated] = await this.drizzle.db
      .update(tasks)
      .set({
        assigneeId: dto.assigneeId ?? null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updated;
  }

  async remove(id: number) {
    const task = await this.findOne(id);

    await this.drizzle.db.delete(tasks).where(eq(tasks.id, id));

    return task;
  }
}
