import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'sudoku-ui-storage',
    }
  )
);
