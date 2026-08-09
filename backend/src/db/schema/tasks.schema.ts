import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { teams } from './teams.schema';
import { users } from './users.schema';

export const taskStatusEnum = pgEnum('task_status', [
  'backlog',
  'todo',
  'in_progress',
  'review',
  'done',
]);

export const boardTypeEnum = pgEnum('board_type', ['personal', 'team']);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('backlog'),
  epic: varchar('epic', { length: 128 }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  loggedMinutes: integer('logged_minutes').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  boardType: boardTypeEnum('board_type').notNull().default('team'),
  assigneeId: integer('assignee_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  teamId: integer('team_id')
    .references(() => teams.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
