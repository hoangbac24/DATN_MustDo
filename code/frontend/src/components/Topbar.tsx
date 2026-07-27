'use client';

import { Menu, Bell, User } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export default function Topbar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-border bg-background/80 px-6 backdrop-blur-glass">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-surface-border bg-white/5">
          <User className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
