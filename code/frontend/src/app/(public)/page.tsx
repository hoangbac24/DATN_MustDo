import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:text-6xl">
        TaskFlow Platform
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-400">
        Enterprise personal productivity architecture built with Next.js 16 and Spring Boot 3.4+.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Sign In
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 border border-surface-border transition-all active:scale-[0.98]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
