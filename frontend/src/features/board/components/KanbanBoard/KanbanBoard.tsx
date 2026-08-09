import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import type { TaskAPI, TaskStatusAPI, UserAPI } from '../../../../shared/types/orchestra.types';
import { TASK_COLUMNS } from '../../../../shared/types/orchestra.types';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';
import { TaskCard } from '../TaskCard/TaskCard';
import './KanbanBoard.scss';

interface KanbanBoardProps {
  tasks: TaskAPI[];
  users: UserAPI[];
  onTasksChange: (tasks: TaskAPI[]) => void;
}

export function KanbanBoard({ tasks, users, onTasksChange }: KanbanBoardProps) {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const usersById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      TASK_COLUMNS.map((column) => [column.id, [] as TaskAPI[]]),
    ) as Record<TaskStatusAPI, TaskAPI[]>;

    for (const task of tasks) {
      grouped[task.status].push(task);
    }

    for (const column of TASK_COLUMNS) {
      grouped[column.id].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return grouped;
  }, [tasks]);

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : undefined;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(Number(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null);
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeTaskItem = tasks.find((task) => task.id === activeId);
    if (!activeTaskItem) return;

    const overColumn = TASK_COLUMNS.find((column) => column.id === overId)?.id;
    const overTask = tasks.find((task) => task.id === Number(overId));

    const targetStatus = overColumn ?? overTask?.status ?? activeTaskItem.status;
    const columnTasks = tasks
      .filter((task) => task.status === targetStatus && task.id !== activeId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    let nextSortOrder = columnTasks.length;

    if (overTask && overTask.status === targetStatus) {
      const overIndex = columnTasks.findIndex((task) => task.id === overTask.id);
      nextSortOrder = overIndex >= 0 ? overIndex : columnTasks.length;
    }

    const reordered = tasks.map((task) => {
      if (task.id !== activeId) return task;
      return {
        ...task,
        status: targetStatus,
        sortOrder: nextSortOrder,
        updatedAt: new Date().toISOString(),
      };
    });

    const sameColumnTasks = reordered
      .filter((task) => task.status === targetStatus)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const activeIndex = sameColumnTasks.findIndex((task) => task.id === activeId);
    const overIndex = overTask
      ? sameColumnTasks.findIndex((task) => task.id === overTask.id)
      : sameColumnTasks.length - 1;

    if (activeIndex >= 0 && overIndex >= 0 && activeIndex !== overIndex) {
      const moved = arrayMove(sameColumnTasks, activeIndex, overIndex).map(
        (task, index) => ({ ...task, sortOrder: index }),
      );

      const movedIds = new Set(moved.map((task) => task.id));
      onTasksChange(
        reordered.map((task) =>
          movedIds.has(task.id)
            ? moved.find((item) => item.id === task.id)!
            : task,
        ),
      );
      return;
    }

    onTasksChange(reordered);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {TASK_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.label}
            tasks={tasksByColumn[column.id]}
            usersById={usersById}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            assignee={
              activeTask.assigneeId
                ? usersById.get(activeTask.assigneeId)
                : undefined
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
