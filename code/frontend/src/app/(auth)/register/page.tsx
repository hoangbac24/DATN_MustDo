import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-sm text-gray-400 mt-1">Get started with TaskFlow</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="mt-1 w-full rounded-lg border border-surface-border bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            placeholder="user@taskflow.dev"
            className="mt-1 w-full rounded-lg border border-surface-border bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-surface-border bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-white hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
