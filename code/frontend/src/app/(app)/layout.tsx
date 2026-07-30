import React from 'react';
import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#090d16] text-white">
      <WorkspaceSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
