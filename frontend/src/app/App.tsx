import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <AppRouter
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      />
    </BrowserRouter>
  );
}
