export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Mission Control</h1>
          <span className="text-sm text-muted-foreground">v0.1 (WIP)</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Fleet Overview', desc: 'Agent status, models, last activity' },
            { title: 'Agent Inspector', desc: 'View & edit workspace files (SOUL, RULES, …)' },
            { title: 'Sessions', desc: 'History & activity feed (next)' },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border p-4">
              <div className="text-base font-medium">{c.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-xl border p-4">
          <div className="text-sm font-medium">Health</div>
          <p className="mt-1 text-sm text-muted-foreground">
            API: <code className="rounded bg-muted px-1.5 py-0.5">/api/health</code>
          </p>
        </section>
      </main>
    </div>
  );
}
