# Mission Control

Mission Control ist das Dashboard für das Morpheus Multi-Agent System auf Basis von OpenClaw.

Die App macht den Zustand, das Wissen und die Aktivitäten aller Agents an einem Ort sichtbar und steuerbar — ohne SSH-Zugriff auf den Server. Ziel ist eine zentrale Oberfläche, um Agents zu überwachen, Workspace-Dateien einzusehen und zu bearbeiten, Cronjobs auszulösen sowie Sessions, Memory, Tasks und Konfigurationen komfortabel zu verwalten.

## Features

- Fleet Overview aller Agents mit Status, Heartbeat und Aktivität
- Agent Inspector für SOUL.md, AGENTS.md, IDENTITY.md, USER.md, TOOLS.md und HEARTBEAT.md
- Live Activity Feed mit Ereignissen und Systemmeldungen
- Kanban Board für agentenbezogene Tasks
- CronJob Manager zum Anzeigen, Pausieren und Triggern geplanter Aktionen
- Memory & Knowledge Browser für MEMORY.md und Daily Logs
- Session History mit Tool-Calls und Gesprächsverläufen
- Config Editor für `openclaw.json`
- Cost Monitor für Token- und API-Kosten
- Alert Center für Heartbeat-, Kosten- und Fehlerwarnungen

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

> UI-Komponenten (z.B. shadcn/ui), Editor (Monaco) und Charts kommen später in den UI-Stories.

## Ziel

Mission Control ist das Nervenzentrum für Morpheus und seine Sub-Agents: beobachten, verstehen, steuern.

## Development

### Requirements

- Node.js (Corepack empfohlen)
- pnpm

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

### Install

```bash
pnpm install
```

### Run (dev)

```bash
pnpm dev
```

### Lint / Build

```bash
pnpm lint
pnpm build
```

### Base URL

Diese App läuft als Subpath hinter der Morpheuxx-Website:

- `https://morpheuxx.meimberg.io/missioncontrol`

### Health Endpoint

- `GET /missioncontrol/api/health` → `{ "status": "ok", "ts": "..." }`

## Security / Auth (MICO-9)

Google Sign-In via NextAuth + Allowlist.

### Env Vars

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `MICO_ALLOWED_EMAILS` (comma-separated), z.B. `oli@meimberg.io`
- `AUTH_TRUST_HOST=true` (empfohlen hinter Reverse Proxy)

### Google OAuth Redirect URI

- `https://morpheuxx.meimberg.io/missioncontrol/api/auth/callback/google`

## Status

- MICO-8: Next.js Projekt initialisiert
- MICO-9: Google Auth + Allowlist

## Notes

Das Dashboard ist für den internen Einsatz gedacht und läuft direkt auf dem Morpheus-Server mit Dateisystemzugriff auf die OpenClaw-Workspaces.
