import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

config();

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  await db.delete(schema.tasks);
  await db.delete(schema.users);
  await db.delete(schema.teams);

  const [platformTeam, designTeam] = await db
    .insert(schema.teams)
    .values([
      { name: 'Platform', slug: 'platform' },
      { name: 'Design', slug: 'design' },
    ])
    .returning();

  const [owner, admin, alice, bob, carol] = await db
    .insert(schema.users)
    .values([
      {
        name: 'Alex Morgan',
        email: 'alex@orchestra.app',
        role: 'owner',
        avatarUrl: null,
        teamId: platformTeam.id,
      },
      {
        name: 'Jordan Lee',
        email: 'jordan@orchestra.app',
        role: 'admin',
        avatarUrl: null,
        teamId: platformTeam.id,
      },
      {
        name: 'Alice Chen',
        email: 'alice@orchestra.app',
        role: 'user',
        avatarUrl: null,
        teamId: platformTeam.id,
      },
      {
        name: 'Bob Rivera',
        email: 'bob@orchestra.app',
        role: 'user',
        avatarUrl: null,
        teamId: platformTeam.id,
      },
      {
        name: 'Carol Smith',
        email: 'carol@orchestra.app',
        role: 'user',
        avatarUrl: null,
        teamId: designTeam.id,
      },
    ])
    .returning();

  await db.insert(schema.tasks).values([
    {
      title: 'Define onboarding epic',
      description: 'Outline milestones for the first customer rollout.',
      status: 'backlog',
      epic: 'Onboarding',
      dueDate: new Date('2026-09-15'),
      loggedMinutes: 0,
      sortOrder: 0,
      boardType: 'team',
      assigneeId: null,
      teamId: platformTeam.id,
    },
    {
      title: 'API contract for tasks',
      description: 'Finalize REST endpoints and DTO naming.',
      status: 'backlog',
      epic: 'Platform',
      dueDate: new Date('2026-08-20'),
      loggedMinutes: 45,
      sortOrder: 1,
      boardType: 'team',
      assigneeId: alice.id,
      teamId: platformTeam.id,
    },
    {
      title: 'Wire team board filters',
      description: 'Filter by assignee, epic, and due date.',
      status: 'todo',
      epic: 'Board',
      dueDate: new Date('2026-08-25'),
      loggedMinutes: 30,
      sortOrder: 0,
      boardType: 'team',
      assigneeId: bob.id,
      teamId: platformTeam.id,
    },
    {
      title: 'Personal sprint planning',
      description: 'Prepare personal board for the week.',
      status: 'todo',
      epic: null,
      dueDate: new Date('2026-08-12'),
      loggedMinutes: 15,
      sortOrder: 0,
      boardType: 'personal',
      assigneeId: alice.id,
      teamId: platformTeam.id,
    },
    {
      title: 'Implement drag-and-drop',
      description: 'Move cards between columns with optimistic UI.',
      status: 'in_progress',
      epic: 'Board',
      dueDate: new Date('2026-08-18'),
      loggedMinutes: 120,
      sortOrder: 0,
      boardType: 'team',
      assigneeId: alice.id,
      teamId: platformTeam.id,
    },
    {
      title: 'Review CRM navigation',
      description: 'Validate sidebar IA with design team.',
      status: 'review',
      epic: 'UX',
      dueDate: new Date('2026-08-14'),
      loggedMinutes: 90,
      sortOrder: 0,
      boardType: 'team',
      assigneeId: carol.id,
      teamId: designTeam.id,
    },
    {
      title: 'Ship v0 demo',
      description: 'Demo-ready build for internal stakeholders.',
      status: 'done',
      epic: 'Release',
      dueDate: new Date('2026-08-01'),
      loggedMinutes: 240,
      sortOrder: 0,
      boardType: 'team',
      assigneeId: admin.id,
      teamId: platformTeam.id,
    },
    {
      title: 'Update profile settings',
      description: 'Allow users to change avatar and display name.',
      status: 'in_progress',
      epic: null,
      dueDate: new Date('2026-08-16'),
      loggedMinutes: 60,
      sortOrder: 0,
      boardType: 'personal',
      assigneeId: bob.id,
      teamId: platformTeam.id,
    },
  ]);

  console.log('Seed completed');
  await pool.end();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
