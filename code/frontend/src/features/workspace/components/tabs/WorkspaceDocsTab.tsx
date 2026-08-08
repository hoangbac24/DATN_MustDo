'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Plus, FileText, ArrowUpRight } from 'lucide-react';

interface WorkspaceDocsTabProps {
  workspaceId: string;
}

export function WorkspaceDocsTab({ workspaceId }: WorkspaceDocsTabProps) {
  return (
    <div className="space-y-6 text-text-primary pb-12">
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <h2 className="text-lg font-bold font-heading text-text-primary">Docs & Wiki Knowledge Base</h2>
          <p className="text-xs text-text-secondary">Centralized space documentation, notes, and technical specs.</p>
        </div>

        <Link
          href={`/workspaces/${workspaceId}/wiki` as any}
          className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Document</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-xs transition hover:border-primary/40">
          <div className="flex items-center justify-between">
            <FileText className="h-6 w-6 text-primary" />
            <Link href={`/workspaces/${workspaceId}/wiki` as any} className="text-text-muted hover:text-primary">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <h3 className="mt-3 text-sm font-bold text-text-primary font-heading">Project Overview & Architecture</h3>
          <p className="mt-1 text-xs text-text-secondary line-clamp-2">System components, data flow schemas, and deployment guidelines.</p>
          <div className="mt-4 flex items-center justify-between text-[11px] text-text-muted border-t border-surface-border pt-3">
            <span>Updated yesterday</span>
            <span className="font-semibold text-primary">View Doc</span>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-xs transition hover:border-primary/40">
          <div className="flex items-center justify-between">
            <BookOpen className="h-6 w-6 text-emerald-500" />
            <Link href={`/workspaces/${workspaceId}/wiki` as any} className="text-text-muted hover:text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <h3 className="mt-3 text-sm font-bold text-text-primary font-heading">Team Onboarding Guide</h3>
          <p className="mt-1 text-xs text-text-secondary line-clamp-2">Instructions for new contributors, environment variables, and branch naming standards.</p>
          <div className="mt-4 flex items-center justify-between text-[11px] text-text-muted border-t border-surface-border pt-3">
            <span>Updated 3 days ago</span>
            <span className="font-semibold text-emerald-500">View Doc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
