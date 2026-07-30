'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Folder, Archive, Settings, ArrowRight } from 'lucide-react';
import type { ProjectDto } from '../types';
import { useToggleFavoriteProject } from '../hooks/use-project';

interface ProjectCardProps {
  project: ProjectDto;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const toggleFavorite = useToggleFavoriteProject();

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md transition hover:border-white/20 hover:shadow-xl">
      <div>
        {/* Color Bar Accent */}
        <div
          className="absolute left-0 top-0 h-1.5 w-full rounded-t-2xl"
          style={{ backgroundColor: project.color || '#6366f1' }}
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white shadow-md"
              style={{ backgroundColor: project.color || '#6366f1' }}
            >
              <Folder className="h-4 w-4" />
            </div>
            <div>
              <Link
                href={`/projects/${project.id}` as any}
                className="text-sm font-semibold text-white font-heading hover:text-indigo-400 transition"
              >
                {project.name}
              </Link>
              {project.isArchived && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                  <Archive className="mr-1 h-3 w-3" /> Archived
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleFavorite.mutate(project.id)}
            title={project.isFavorite ? 'Unfavorite' : 'Favorite'}
            className={`rounded-lg p-1.5 transition ${
              project.isFavorite
                ? 'text-amber-400 hover:bg-amber-500/10'
                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}
          >
            <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-gray-400">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[10px] text-gray-500 font-mono">
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
        </span>

        <div className="flex items-center space-x-2">
          <Link
            href={`/projects/${project.id}/settings` as any}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            href={`/projects/${project.id}` as any}
            className="flex items-center space-x-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition"
          >
            <span>Open</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
