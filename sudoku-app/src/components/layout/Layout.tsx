import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { AppTopBar } from './AppTopBar';
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
    <div className="flex h-dvh min-h-dvh max-h-dvh bg-primary text-tx-primary font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-mobile-nav md:pb-0 relative flex flex-col pt-[env(safe-area-inset-top,0px)]">
        <div className="w-full flex-1 flex flex-col min-h-0 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
          <AppTopBar />
          <div className="flex-1 min-h-0 w-full">
            <Outlet />
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
};
