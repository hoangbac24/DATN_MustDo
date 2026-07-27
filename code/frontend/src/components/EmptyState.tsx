import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by creating a new entity.',
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-surface-border p-8 text-center">
      <FolderOpen className="h-12 w-12 text-gray-500 mb-4" />
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
