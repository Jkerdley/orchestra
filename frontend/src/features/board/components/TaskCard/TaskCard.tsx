import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';
import type { TaskAPI, UserAPI } from '../../../../shared/types/orchestra.types';
import './TaskCard.scss';

interface TaskCardProps {
  task: TaskAPI;
  assignee?: UserAPI;
  categoryColor?: string;
}

export function TaskCard({ task, assignee, categoryColor }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--task-category-color': categoryColor ?? '#94a3b8',
  } as CSSProperties;

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card__head">
        {task.epic && <span className="task-card__epic">{task.epic}</span>}
        <button type="button" className="task-card__menu" aria-label="Task actions">
          ⋯
        </button>
      </div>
      <h3 className="task-card__title">{task.title}</h3>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      <div className="task-card__meta">
        {dueLabel && <span className="task-card__due">{dueLabel}</span>}
        <span className="task-card__time">{Math.round(task.loggedMinutes / 60)}h</span>
        {assignee && (
          <span className="task-card__assignee" title={assignee.name}>
            {assignee.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
        )}
      </div>
    </article>
  );
}
