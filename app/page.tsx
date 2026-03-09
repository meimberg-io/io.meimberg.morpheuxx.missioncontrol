import { Activity, Bell, Bot, Clock3, LayoutDashboard } from "lucide-react";

import { AgentRoster } from "@/components/agent-roster";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1b1f31,transparent_35%),linear-gradient(180deg,#0b0d12_0%,#090b10_100%)] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-white/10 bg-black/20 px-5 py-6 backdrop-blur">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                Morpheus System
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Mission Control</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Operator console for the OpenClaw multi-agent fleet.
              </p>
            </div>

            <Separator className="bg-white/10" />

            <nav className="space-y-1 text-sm" aria-label="Main navigation">
              <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.08] px-3 py-2 font-medium text-white">
                <LayoutDashboard className="h-4 w-4" />
                Fleet Overview
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-zinc-500">
                <Bot className="h-4 w-4" />
                Agent Inspector
                <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-zinc-700">
                  soon
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-zinc-500">
                <Activity className="h-4 w-4" />
                Activity
                <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-zinc-700">
                  soon
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-zinc-500">
                <Bell className="h-4 w-4" />
                Alerts
                <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-zinc-700">
                  soon
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-zinc-500">
                <Clock3 className="h-4 w-4" />
                Sessions
                <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-zinc-700">
                  soon
                </span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <section className="px-6 py-6 lg:px-8">
          <header className="border-b border-white/10 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Operator Console
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Fleet Overview
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Live roster of registered agents. Status sourced from the discovery API.
            </p>
          </header>

          <div className="mt-6">
            <AgentRoster />
          </div>
        </section>
      </div>
    </main>
  );
}
