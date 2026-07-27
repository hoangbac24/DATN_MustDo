import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface/50 p-8 backdrop-blur-glass shadow-2xl">
        {children}
      </div>
    </div>
  );
}
