'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Folder, Settings, Archive } from 'lucide-react';
import type { ProjectDto } from '../types';
import { useToggleFavoriteProject } from '../hooks/use-project';

interface ProjectHeaderProps {
  project: ProjectDto;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const toggleFavorite = useToggleFavoriteProject();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-xl">
      <div
        className="absolute left-0 top-0 h-1.5 w-full"
        style={{ backgroundColor: project.color || '#6366f1' }}
      />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center space-x-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold shadow-lg"
            style={{ backgroundColor: project.color || '#6366f1' }}
          >
            <Folder className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white font-heading">{project.name}</h1>
              {project.isArchived && (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                  <Archive className="mr-1 h-3 w-3" /> Archived
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              {project.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleFavorite.mutate(project.id)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
              project.isFavorite
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-amber-400' : ''}`} />
            <span>{project.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <Link
            href={`/projects/${project.id}/settings` as any}
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
