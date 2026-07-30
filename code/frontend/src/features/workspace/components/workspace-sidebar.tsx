'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  LogOut,
  User,
  Settings,
  Plus,
} from 'lucide-react';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { useProjects } from '@/features/project/hooks/use-project';
import { CreateProjectDialog } from '@/features/project/components/create-project-dialog';

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const logoutMutation = useLogout();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const { data: projects = [] } = useProjects(activeWorkspace?.id || null);

  const navItems = [
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Workspaces', href: '/workspaces', icon: Layers },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-[#090d16] p-4 text-gray-300">
        {/* Brand Header */}
        <div className="mb-6 flex items-center space-x-2 px-2">
          <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">
            Task<span className="text-indigo-500">Flow</span>
          </h1>
        </div>

        {/* Workspace Switcher */}
        <div className="mb-6">
          <WorkspaceSwitcher />
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/settings' && pathname.startsWith('/settings'));
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Projects Section */}
        {activeWorkspace && (
          <div className="mt-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Projects ({projects.length})
              </span>
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                title="Create Project"
                className="rounded-md p-1 text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-1 space-y-0.5">
              {projects.map((project) => {
                const projectHref = `/projects/${project.id}`;
                const isActive = pathname === projectHref;
                return (
                  <Link
                    key={project.id}
                    href={projectHref as any}
                    className={`flex items-center space-x-2.5 rounded-xl px-3 py-2 text-xs transition ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                );
              })}

              {projects.length === 0 && (
                <p className="px-3 py-2 text-[11px] text-gray-500 italic">No projects yet</p>
              )}
            </div>
          </div>
        )}

        {/* User Footer Profile */}
        <div className="border-t border-white/10 pt-4 mt-auto">
          <div className="flex items-center justify-between rounded-xl bg-gray-900/40 p-2">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {user?.fullName?.substring(0, 1).toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              title="Sign Out"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {activeWorkspace && (
        <CreateProjectDialog
          workspaceId={activeWorkspace.id}
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
        />
      )}
    </>
  );
}
