import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useUiStore } from '../../store/uiStore';

export const Layout: React.FC = () => {
  const { theme } = useUiStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-primary text-tx-primary font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative flex flex-col">
        <div className="w-full flex-1">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
};
