import { Activity, Bell, Bot, Clock3, LayoutDashboard, Shield } from "lucide-react";

import { AgentRoster } from "@/components/agent-roster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    title: "Fleet Overview",
    description: "Sprint-1-Ziel: erste Agent-Übersicht mit echter API-Anbindung.",
    icon: LayoutDashboard,
  },
  {
    title: "Protected Surface",
    description: "Die technische Grundlage für geschützte Routen wird in diesem Bootstrap vorbereitet.",
    icon: Shield,
  },
  {
    title: "Operator Focus",
    description: "Dark-first, nüchtern, auf Monitoring und Steuerung statt Marketing optimiert.",
    icon: Activity,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1b1f31,transparent_35%),linear-gradient(180deg,#0b0d12_0%,#090b10_100%)] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-black/20 px-5 py-6 backdrop-blur">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                Morpheus System
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Mission Control</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Bootstrap shell for the OpenClaw operator dashboard.
              </p>
            </div>

            <Separator className="bg-white/10" />

            <nav className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-white">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
                <Bot className="h-4 w-4" />
                Agents
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
                <Bell className="h-4 w-4" />
                Activity
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
                <Clock3 className="h-4 w-4" />
                Sessions
              </div>
            </nav>

            <Card className="border-white/10 bg-white/5 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Sprint 1</CardTitle>
                <CardDescription>
                  Foundation first: bootstrap, deployability, first roster slice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  MICO-11 in progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        <section className="px-6 py-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Operator Console</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Fleet Overview
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Agent roster loaded live from the discovery API. Coarse status only for this POC slice.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                View workflow
              </Button>
              <Button>Open sprint</Button>
            </div>
          </header>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {highlights.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="border-white/10 bg-white/5 shadow-none">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="pt-3 text-lg text-white">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="border-white/10 bg-white/5 shadow-none">
              <AgentRoster />
            </Card>

            <Card className="border-white/10 bg-white/5 shadow-none">
              <CardHeader>
                <CardTitle className="text-white">Bootstrap outcomes</CardTitle>
                <CardDescription>What MICO-8 is meant to establish.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <p>• Next.js 15 App Router baseline</p>
                <p>• Strict TypeScript setup</p>
                <p>• Tailwind v4 + shadcn/ui foundation</p>
                <p>• Dark-first app shell for future features</p>
                <p>• Room for route protection in MICO-9</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
