"use client";

import { useEffect, useState } from "react";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agent } from "@/lib/agents";

const STATUS_STYLES: Record<string, string> = {
  online: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  idle: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  offline: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
  unknown: "bg-zinc-800/60 text-zinc-600 border-zinc-700/40",
};

function statusDot(status: string) {
  const colors: Record<string, string> = {
    online: "bg-emerald-400",
    idle: "bg-amber-400",
    offline: "bg-zinc-600",
    unknown: "bg-zinc-700",
  };
  return colors[status] ?? colors.unknown;
}

export function AgentRoster() {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => setAgents(data.agents))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-white">Known agents</CardTitle>
        <CardDescription>
          {agents
            ? `${agents.length} agents via /api/agents`
            : error
              ? "Could not load agent roster."
              : "Loading roster…"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p className="text-sm text-zinc-500">
            Agent discovery unavailable. Check API connection.
          </p>
        )}
        {agents?.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none" aria-hidden>
                {agent.emoji}
              </span>
              <div>
                <p className="font-medium text-white">{agent.name}</p>
                <p className="text-sm text-zinc-400">{agent.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${STATUS_STYLES[agent.status] ?? STATUS_STYLES.unknown}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot(agent.status)}`} />
                {agent.status}
              </span>
            </div>
          </div>
        ))}
        {!agents && !error && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-[60px] animate-pulse rounded-lg border border-white/5 bg-white/5"
              />
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}
