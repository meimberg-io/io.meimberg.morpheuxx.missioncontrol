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

- Next.js 15
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Monaco Editor
- Recharts

## Ziel

Mission Control ist das Nervenzentrum für Morpheus und seine Sub-Agents: beobachten, verstehen, steuern.

## Status

In Planung / Initialaufbau.

## Prozess

- [Workflow-Regeln](docs/workflow.md)

## Local Development

### Voraussetzungen

- Node.js 22+
- pnpm 9+

### Starten

```bash
pnpm install
pnpm dev
```

Danach ist die App unter `http://localhost:3000` erreichbar.

### Nützliche Commands

```bash
pnpm lint
pnpm build
pnpm format
pnpm format:check
```

## Architektur-Notizen

- `app/` enthält den App-Router und die initiale UI-Shell
- `components/ui/` enthält shadcn/ui-Bausteine
- `lib/auth.ts` reserviert die technische Grundlage für spätere Route-Protection in `MICO-9`
- Die erste UI ist bewusst ein dunkles Operator-Dashboard-Skeleton und noch kein finales Design

## Notes

Das Dashboard ist für den internen Einsatz gedacht und läuft direkt auf dem Morpheus-Server mit Dateisystemzugriff auf die OpenClaw-Workspaces.
