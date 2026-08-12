import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../layout/components/Header/Header';
import type { BoardTypeAPI, TaskAPI } from '../../../../shared/types/orchestra.types';
import { orchestraMock } from '../../mocks/orchestra.mock';
import { BoardToolbar } from '../../components/BoardToolbar/BoardToolbar';
import { KanbanBoard } from '../../components/KanbanBoard/KanbanBoard';
import './BoardPage.scss';

const MAX_LEVEL = 200;
const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  Onboarding: '#db7d4e',
  Platform: '#5b5bd6',
  Board: '#168a72',
  UX: '#bd5da7',
  Release: '#d49a24',
};

function getXpRequiredForLevel(level: number) {
  return 800 + level * 50 + level * level * 9;
}

function getTaskXp(task: TaskAPI) {
  return 120 + Math.min(180, Math.round(task.loggedMinutes / 15) * 15);
}

export function BoardPage() {
  const { boardType = 'team' } = useParams<{ boardType: BoardTypeAPI }>();
  const [tasks, setTasks] = useState<TaskAPI[]>(orchestraMock.tasks);
  const [query, setQuery] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [categoryColors, setCategoryColors] = useState(DEFAULT_CATEGORY_COLORS);
  const [playerProgress, setPlayerProgress] = useState({
    level: 24,
    xp: getXpRequiredForLevel(24) - 680,
  });
  const [lastXpReward, setLastXpReward] = useState<number | null>(null);
  const rewardedTaskIds = useRef(
    new Set(
      orchestraMock.tasks
        .filter((task) => task.status === 'done')
        .map((task) => task.id),
    ),
  );

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

  const categories = useMemo(
    () =>
      Array.from(new Set(tasks.flatMap((task) => (task.epic ? [task.epic] : [])))).sort(),
    [tasks],
  );

  const xpRequired = getXpRequiredForLevel(playerProgress.level);
  const xpProgress = Math.min(100, (playerProgress.xp / xpRequired) * 100);

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

  const handleTaskCompleted = (task: TaskAPI) => {
    if (rewardedTaskIds.current.has(task.id)) return;

    rewardedTaskIds.current.add(task.id);
    const earnedXp = getTaskXp(task);
    setLastXpReward(earnedXp);
    setPlayerProgress((current) => {
      let level = current.level;
      let xp = current.xp + earnedXp;

      while (level < MAX_LEVEL && xp >= getXpRequiredForLevel(level)) {
        xp -= getXpRequiredForLevel(level);
        level += 1;
      }

      return { level, xp };
    });
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
              <strong>Level {playerProgress.level}</strong>
              <span>
                {playerProgress.level === MAX_LEVEL
                  ? 'Maximum level reached'
                  : `${xpRequired - playerProgress.xp} XP to level ${playerProgress.level + 1}`}
              </span>
            </div>
            <div
              className="board-page__growth-progress"
              aria-label={`${playerProgress.xp} of ${xpRequired} XP`}
            >
              <span style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
          <div className="board-page__achievement">
            <span aria-hidden="true">⚡</span>
            <span>{lastXpReward ? `+${lastXpReward} XP earned` : '3-day focus streak'}</span>
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
        categories={categories}
        categoryColors={categoryColors}
        onCategoryColorChange={(category, color) =>
          setCategoryColors((current) => ({ ...current, [category]: color }))
        }
      />
      <KanbanBoard
        tasks={visibleTasks}
        users={orchestraMock.users}
        categoryColors={categoryColors}
        onTaskCompleted={handleTaskCompleted}
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
