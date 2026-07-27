'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  FolderKanban, 
  Calendar, 
  Bell, 
  Settings, 
  User, 
  Sparkles, 
  LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/utils';
import { useUiStore } from '@/store/uiStore';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUiStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 border-r border-surface-border bg-background/80 backdrop-blur-glass transition-transform duration-300',
        !sidebarOpen && '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-surface-border">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          TaskFlow
        </span>
      </div>

      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
