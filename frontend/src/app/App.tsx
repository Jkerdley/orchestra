import { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRouter } from './router';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <HashRouter>
      <AppRouter
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      />
    </HashRouter>
  );
}
