"use client";

import { useEffect, useState } from "react";

import type { Agent } from "@/lib/agents";

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { badge: string; dot: string; borderLeft: string; pulse: boolean }
> = {
  online: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
    borderLeft: "border-l-emerald-500/60",
    pulse: true,
  },
  idle: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
    borderLeft: "border-l-amber-500/40",
    pulse: false,
  },
  offline: {
    badge: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
    dot: "bg-zinc-600",
    borderLeft: "border-l-zinc-600/30",
    pulse: false,
  },
  unknown: {
    badge: "bg-zinc-800/60 text-zinc-600 border-zinc-700/40",
    dot: "bg-zinc-700",
    borderLeft: "border-l-zinc-700/20",
    pulse: false,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "never";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function shortModel(model: string): string {
  return model.replace(/^claude-/, "");
}

function statusCounts(agents: Agent[]) {
  return {
    online: agents.filter((a) => a.status === "online").length,
    idle: agents.filter((a) => a.status === "idle").length,
    offline: agents.filter((a) => a.status === "offline").length,
    unknown: agents.filter((a) => a.status === "unknown").length,
  };
}

// ---------------------------------------------------------------------------
// AgentCard
// ---------------------------------------------------------------------------

function AgentCard({ agent }: { agent: Agent }) {
  const cfg = STATUS_CONFIG[agent.status] ?? STATUS_CONFIG.unknown;

  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-xl border border-l-2 border-white/10 ${cfg.borderLeft} bg-black/30 px-5 py-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]`}
      aria-label={`Agent ${agent.name}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xl leading-none"
            aria-hidden
          >
            {agent.emoji}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight text-white">{agent.name}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-500">{agent.role}</p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${cfg.badge}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {cfg.pulse && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-70`}
              />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          </span>
          {agent.status}
        </span>
      </div>

      {/* Meta grid */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <div>
          <dt className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
            Workspace
          </dt>
          <dd className="font-mono text-zinc-300">{agent.workspace || "—"}</dd>
        </div>

        <div>
          <dt className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
            Model
          </dt>
          <dd>
            <span className="inline-block rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              {shortModel(agent.model)}
            </span>
          </dd>
        </div>

        <div className="col-span-2">
          <dt className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
            Last seen
          </dt>
          <dd className="text-zinc-400">{formatLastSeen(agent.lastSeen)}</dd>
        </div>
      </dl>
    </article>
  );
}

// ---------------------------------------------------------------------------
// SkeletonCard — loading placeholder
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/[0.06]" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 rounded bg-white/[0.04]" />
        <div className="h-8 rounded bg-white/[0.04]" />
        <div className="col-span-2 h-5 w-24 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentRoster — main export
// ---------------------------------------------------------------------------

export function AgentRoster() {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<{ agents: Agent[] }>;
      })
      .then((data) => setAgents(data.agents))
      .catch(() => setError(true));
  }, []);

  // ---- Error state ----
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-14 text-center">
        <span className="text-3xl" aria-hidden>
          ⚠️
        </span>
        <p className="text-sm font-medium text-red-400">Agent discovery unavailable</p>
        <p className="text-xs text-zinc-500">
          Could not reach <code className="font-mono">/api/agents</code>. Check API connection.
        </p>
      </div>
    );
  }

  const counts = agents ? statusCounts(agents) : null;

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex items-center gap-5 text-sm">
        {counts ? (
          <>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {counts.online} online
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {counts.idle} idle
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              {counts.offline + counts.unknown} offline
            </span>
            <span className="ml-auto text-xs text-zinc-600">{agents!.length} agents total</span>
          </>
        ) : (
          <span className="text-zinc-600">Scanning fleet…</span>
        )}
      </div>

      {/* Card grid */}
      {!agents ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-6 py-14 text-center">
          <span className="text-3xl" aria-hidden>
            📡
          </span>
          <p className="text-sm text-zinc-500">No agents registered in the fleet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
