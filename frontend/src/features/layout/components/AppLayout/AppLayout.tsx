import { NavLink, Outlet } from 'react-router-dom';
import { orchestraMock } from '../../../board/mocks/orchestra.mock';
import './AppLayout.scss';

interface AppLayoutProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function AppLayout({ sidebarCollapsed, onToggleSidebar }: AppLayoutProps) {
  return (
    <div
      className={`app-layout ${sidebarCollapsed ? 'app-layout--collapsed' : ''}`}
    >
      <aside className="app-layout__sidebar">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
        />
      </aside>
      <div className="app-layout__main">
        <Outlet />
      </div>
    </div>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

function Sidebar({ collapsed, onToggleSidebar }: SidebarProps) {
  const { teams, currentUser } = orchestraMock;
  const activeTeam = teams.find((team) => team.id === currentUser.teamId);

  return (
    <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__logo">O</span>
          {!collapsed && <span className="sidebar__title">Orchestra</span>}
        </div>
        <button
          type="button"
          className="sidebar__toggle"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && activeTeam && (
        <div className="sidebar__team">
          <span className="sidebar__team-label">Team</span>
          <button type="button" className="sidebar__team-select">
            {activeTeam.name}
            <span className="sidebar__chevron">▾</span>
          </button>
        </div>
      )}

      <ul className="sidebar__nav">
        <li>
          <NavLink
            to="/board/team"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">▦</span>
            {!collapsed && <span>Team board</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/board/personal"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">◫</span>
            {!collapsed && <span>My board</span>}
          </NavLink>
        </li>
      </ul>

      <div className="sidebar__footer">
        {!collapsed && (
          <div className="sidebar__level">
            <div className="sidebar__level-icon" aria-hidden="true">24</div>
            <div className="sidebar__level-info">
              <span className="sidebar__level-label">Growth level</span>
              <div className="sidebar__level-progress">
                <span style={{ width: '68%' }} />
              </div>
              <span className="sidebar__level-caption">680 / 1,000 XP</span>
            </div>
          </div>
        )}
        <div className="sidebar__user">
          <span className="sidebar__avatar">
            {currentUser.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          {!collapsed && (
            <div className="sidebar__user-meta">
              <span className="sidebar__user-name">{currentUser.name}</span>
              <span className="sidebar__user-role">{currentUser.role}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
