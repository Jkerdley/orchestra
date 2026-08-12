import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../layout/components/Header/Header';
import type { BoardTypeAPI, TaskAPI } from '../../../../shared/types/orchestra.types';
import { orchestraMock } from '../../mocks/orchestra.mock';
import { BoardToolbar } from '../../components/BoardToolbar/BoardToolbar';
import { KanbanBoard } from '../../components/KanbanBoard/KanbanBoard';
import './BoardPage.scss';

export function BoardPage() {
  const { boardType = 'team' } = useParams<{ boardType: BoardTypeAPI }>();
  const [tasks, setTasks] = useState<TaskAPI[]>(orchestraMock.tasks);
  const [query, setQuery] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);

  const filteredTasks = useMemo(() => {
    const teamId = orchestraMock.currentUser.teamId;
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return tasks.filter((task) => {
      if (task.boardType !== boardType) return false;
      if (boardType === 'team') return task.teamId === teamId;
      if (task.assigneeId !== orchestraMock.currentUser.id) return false;
      return !normalizedQuery || `${task.title} ${task.description ?? ''} ${task.epic ?? ''}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [boardType, query, tasks]);

  const activeTeam = orchestraMock.teams.find(
    (team) => team.id === orchestraMock.currentUser.teamId,
  );

  const title = boardType === 'team' ? `${activeTeam?.name ?? 'Team'} board` : 'My board';
  const subtitle =
    boardType === 'team'
      ? 'Shared kanban for the whole team'
      : 'Personal tasks assigned to you';

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return filteredTasks.filter((task) => {
      if (onlyMine && task.assigneeId !== orchestraMock.currentUser.id) return false;
      return !normalizedQuery || `${task.title} ${task.description ?? ''} ${task.epic ?? ''}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [filteredTasks, onlyMine, query]);

  const handleCreateTask = () => {
    const nextId = Math.max(...tasks.map((task) => task.id), 0) + 1;
    const currentColumnTasks = tasks.filter(
      (task) => task.boardType === boardType && task.status === 'todo',
    );

    setTasks((current) => [
      ...current,
      {
        id: nextId,
        title: 'Untitled task',
        description: 'Add the next action and assignee when you are ready.',
        status: 'todo',
        epic: null,
        dueDate: null,
        loggedMinutes: 0,
        sortOrder: currentColumnTasks.length,
        boardType,
        assigneeId: orchestraMock.currentUser.id,
        teamId: orchestraMock.currentUser.teamId ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="board-page">
      <Header title={title} subtitle={subtitle} />
      <section className="board-page__overview" aria-label="Sprint and growth overview">
        <div className="board-page__sprint">
          <span className="board-page__eyebrow">Current sprint</span>
          <div className="board-page__sprint-title">
            <strong>Sprint 12</strong>
            <span>Ends in 6 days</span>
          </div>
          <div className="board-page__sprint-progress" aria-label="Sprint is 72% complete">
            <span style={{ width: '72%' }} />
          </div>
          <span className="board-page__sprint-caption">72% of planned work complete</span>
        </div>
        <div className="board-page__growth">
          <div className="board-page__growth-medal" aria-hidden="true">✦</div>
          <div>
            <span className="board-page__eyebrow">Your growth</span>
            <div className="board-page__growth-title">
              <strong>Level 24</strong>
              <span>680 XP to level 25</span>
            </div>
          </div>
          <div className="board-page__achievement">
            <span aria-hidden="true">⚡</span>
            <span>3-day focus streak</span>
          </div>
        </div>
      </section>
      <BoardToolbar
        boardLabel={boardType === 'team' ? 'Team' : 'Personal'}
        taskCount={visibleTasks.length}
        query={query}
        onlyMine={onlyMine}
        onQueryChange={setQuery}
        onOnlyMineChange={setOnlyMine}
        onCreateTask={handleCreateTask}
      />
      <KanbanBoard
        tasks={visibleTasks}
        users={orchestraMock.users}
        onTasksChange={(nextTasks) => {
          setTasks((current) =>
            current.map(
              (task) => nextTasks.find((item) => item.id === task.id) ?? task,
            ),
          );
        }}
      />
    </div>
  );
}
