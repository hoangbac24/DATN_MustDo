'use client';

import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { NotificationDropdown } from '@/features/notification/components/notification-dropdown';
import { SearchBar } from '@/features/search/components/search-bar';
import { SearchModal } from '@/features/search/components/search-modal';

export default function Topbar() {
  const { toggleSidebar } = useUiStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-border bg-background/80 px-6 backdrop-blur-glass">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <SearchBar onOpenModal={() => setIsSearchOpen(true)} />
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-surface-border bg-white/5">
          <User className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
