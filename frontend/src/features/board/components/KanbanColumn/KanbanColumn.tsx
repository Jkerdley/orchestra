import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskAPI, UserAPI } from '../../../../shared/types/orchestra.types';
import { TaskCard } from '../TaskCard/TaskCard';
import './KanbanColumn.scss';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: TaskAPI[];
  usersById: Map<number, UserAPI>;
}

export function KanbanColumn({ id, title, tasks, usersById }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
    >
      <header className="kanban-column__header">
        <h2 className="kanban-column__title">{title}</h2>
        <span className="kanban-column__count">{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="kanban-column__list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={task.assigneeId ? usersById.get(task.assigneeId) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}
