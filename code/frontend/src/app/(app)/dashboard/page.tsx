export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome to TaskFlow Personal Productivity Platform</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Tasks', value: '0' },
          { title: 'In Progress', value: '0' },
          { title: 'Completed', value: '0' },
          { title: 'Projects', value: '0' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-surface-border bg-surface/40 p-6 backdrop-blur-glass"
          >
            <span className="text-sm font-medium text-gray-400">{stat.title}</span>
            <div className="mt-2 text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
