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

  const filteredTasks = useMemo(() => {
    const teamId = orchestraMock.currentUser.teamId;

    return tasks.filter((task) => {
      if (task.boardType !== boardType) return false;
      if (boardType === 'team') return task.teamId === teamId;
      return task.assigneeId === orchestraMock.currentUser.id;
    });
  }, [boardType, tasks]);

  const activeTeam = orchestraMock.teams.find(
    (team) => team.id === orchestraMock.currentUser.teamId,
  );

  const title = boardType === 'team' ? `${activeTeam?.name ?? 'Team'} board` : 'My board';
  const subtitle =
    boardType === 'team'
      ? 'Shared kanban for the whole team'
      : 'Personal tasks assigned to you';

  return (
    <div className="board-page">
      <Header title={title} subtitle={subtitle} />
      <BoardToolbar
        boardLabel={boardType === 'team' ? 'Team' : 'Personal'}
        taskCount={filteredTasks.length}
      />
      <KanbanBoard
        tasks={filteredTasks}
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
