/**
 * Agent data layer for MICO-11.
 *
 * ADAPTER BOUNDARY — replace `getAgents()` implementation to pull from
 * ~/.openclaw/openclaw.json or a live heartbeat API when that data is available.
 * The exported types and function signature are the stable contract.
 */

export type AgentStatus = "online" | "idle" | "offline" | "unknown";

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  workspace: string;
  model: string;
  status: AgentStatus;
  lastSeen: string | null; // ISO-8601 or null if never seen
}

// ---------------------------------------------------------------------------
// Seed data — authoritative roster until OpenClaw config is readable
// ---------------------------------------------------------------------------

const SEED: Agent[] = [
  {
    id: "morpheus",
    name: "Morpheus",
    role: "Dispatcher",
    emoji: "🧠",
    workspace: "morpheus",
    model: "claude-opus-4-6",
    status: "online",
    lastSeen: new Date(Date.now() - 45_000).toISOString(),
  },
  {
    id: "neo",
    name: "Neo",
    role: "Dev Specialist",
    emoji: "💻",
    workspace: "coding",
    model: "claude-sonnet-4-6",
    status: "online",
    lastSeen: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "trinity",
    name: "Trinity",
    role: "Secretary",
    emoji: "📋",
    workspace: "sekretariat",
    model: "claude-sonnet-4-6",
    status: "idle",
    lastSeen: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: "tank",
    name: "Tank",
    role: "Utilities & Ops",
    emoji: "⚙️",
    workspace: "kommunikation",
    model: "claude-sonnet-4-6",
    status: "idle",
    lastSeen: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
  {
    id: "oracle",
    name: "Oracle",
    role: "Editorial",
    emoji: "✍️",
    workspace: "redaktion",
    model: "claude-sonnet-4-6",
    status: "offline",
    lastSeen: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
  },
  {
    id: "ux",
    name: "Pixel",
    role: "UX & Design",
    emoji: "🎨",
    workspace: "ux",
    model: "claude-sonnet-4-6",
    status: "unknown",
    lastSeen: null,
  },
];

/**
 * Returns the current agent roster.
 * Degrades gracefully: missing fields fall back to safe defaults.
 */
export function getAgents(): Agent[] {
  return SEED.map((a) => ({
    id: a.id ?? "unknown",
    name: a.name ?? "Unnamed",
    role: a.role ?? "Unknown",
    emoji: a.emoji ?? "🤖",
    workspace: a.workspace ?? "",
    model: a.model ?? "unknown",
    status: (a.status ?? "unknown") as AgentStatus,
    lastSeen: a.lastSeen ?? null,
  }));
}
