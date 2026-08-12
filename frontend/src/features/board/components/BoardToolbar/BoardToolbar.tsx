import { useState } from 'react';
import './BoardToolbar.scss';

interface BoardToolbarProps {
  boardLabel: string;
  taskCount: number;
  query: string;
  onlyMine: boolean;
  onQueryChange: (value: string) => void;
  onOnlyMineChange: (value: boolean) => void;
  onCreateTask: () => void;
  categories: string[];
  categoryColors: Record<string, string>;
  onCategoryColorChange: (category: string, color: string) => void;
}

export function BoardToolbar({
  boardLabel,
  taskCount,
  query,
  onlyMine,
  onQueryChange,
  onOnlyMineChange,
  onCreateTask,
  categories,
  categoryColors,
  onCategoryColorChange,
}: BoardToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryColorsOpen, setCategoryColorsOpen] = useState(false);

  return (
    <div className="board-toolbar">
      <div className="board-toolbar__left">
        <span className="board-toolbar__badge">{boardLabel}</span>
        <span className="board-toolbar__count">{taskCount} tasks</span>
      </div>
      <div className="board-toolbar__right">
        <label className="board-toolbar__search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
          />
        </label>
        <div className="board-toolbar__filter">
          <button
            type="button"
            className={`board-toolbar__button board-toolbar__button--ghost ${onlyMine ? 'board-toolbar__button--selected' : ''}`}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Filter
            {onlyMine && <span className="board-toolbar__filter-dot" />}
            <span className="board-toolbar__chevron">▾</span>
          </button>
          {filtersOpen && (
            <div className="board-toolbar__filter-menu">
              <label className="board-toolbar__filter-option">
                <input
                  type="checkbox"
                  checked={onlyMine}
                  onChange={(event) => onOnlyMineChange(event.target.checked)}
                />
                <span>Assigned to me</span>
              </label>
            </div>
          )}
        </div>
        <div className="board-toolbar__filter">
          <button
            type="button"
            className="board-toolbar__button board-toolbar__button--ghost"
            aria-expanded={categoryColorsOpen}
            onClick={() => setCategoryColorsOpen((open) => !open)}
          >
            Categories <span className="board-toolbar__chevron">▾</span>
          </button>
          {categoryColorsOpen && (
            <div className="board-toolbar__category-menu">
              <span className="board-toolbar__menu-label">Category colors</span>
              {categories.map((category) => (
                <label key={category} className="board-toolbar__category-option">
                  <input
                    type="color"
                    value={categoryColors[category]}
                    onChange={(event) => onCategoryColorChange(category, event.target.value)}
                    aria-label={`${category} color`}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="board-toolbar__button board-toolbar__button--ghost">
          Sprint 12
        </button>
        <button
          type="button"
          className="board-toolbar__button board-toolbar__button--primary"
          onClick={onCreateTask}
        >
          <span aria-hidden="true">+</span> New task
        </button>
      </div>
    </div>
  );
}
