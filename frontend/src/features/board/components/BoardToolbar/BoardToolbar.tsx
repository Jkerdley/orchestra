import './BoardToolbar.scss';

interface BoardToolbarProps {
  boardLabel: string;
  taskCount: number;
}

export function BoardToolbar({ boardLabel, taskCount }: BoardToolbarProps) {
  return (
    <div className="board-toolbar">
      <div className="board-toolbar__left">
        <span className="board-toolbar__badge">{boardLabel}</span>
        <span className="board-toolbar__count">{taskCount} tasks</span>
      </div>
      <div className="board-toolbar__right">
        <button type="button" className="board-toolbar__button board-toolbar__button--ghost">
          Filter
          <span className="board-toolbar__chevron">▾</span>
        </button>
        <button type="button" className="board-toolbar__button board-toolbar__button--ghost">
          Group
          <span className="board-toolbar__chevron">▾</span>
        </button>
        <button type="button" className="board-toolbar__button board-toolbar__button--primary">
          + New task
        </button>
      </div>
    </div>
  );
}
