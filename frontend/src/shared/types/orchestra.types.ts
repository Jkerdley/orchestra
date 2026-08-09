export type UserRoleAPI = 'owner' | 'admin' | 'user';

export type TaskStatusAPI =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done';

export type BoardTypeAPI = 'personal' | 'team';

export interface UserAPI {
  id: number;
  name: string;
  email: string;
  role: UserRoleAPI;
  avatarUrl: string | null;
  teamId: number | null;
  createdAt: string;
}

export interface TeamAPI {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface TaskAPI {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatusAPI;
  epic: string | null;
  dueDate: string | null;
  loggedMinutes: number;
  sortOrder: number;
  boardType: BoardTypeAPI;
  assigneeId: number | null;
  teamId: number;
  createdAt: string;
  updatedAt: string;
}

export const TASK_COLUMNS: { id: TaskStatusAPI; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];
