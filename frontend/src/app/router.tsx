import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../features/layout/components/AppLayout/AppLayout';
import { BoardPage } from '../features/board/pages/BoardPage/BoardPage';

interface AppRouterProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function AppRouter({ sidebarCollapsed, onToggleSidebar }: AppRouterProps) {
  return (
    <Routes>
      <Route
        element={
          <AppLayout
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={onToggleSidebar}
          />
        }
      >
        <Route index element={<Navigate to="/board/team" replace />} />
        <Route path="/board/:boardType" element={<BoardPage />} />
      </Route>
    </Routes>
  );
}
