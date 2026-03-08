**MISSION CONTROL**

Dashboard für das Morpheus Multi-Agent System

**ENTWICKLUNGS-BRIEFING**

Powered by OpenClaw · Next.js / React App

Version 1.0 · März 2026

**0 · Executive Summary**

Dieses Briefing beschreibt vollständig, was dein AI-Agent beim Bau des
Mission Control Dashboards umsetzen soll. Es handelt sich um eine
Next.js-App (alternativ: React SPA), die auf dem Server von Morpheus als
integrierte App neben der bestehenden Website läuft. Das Dashboard ist
das Nervenzentrum des OpenClaw Multi-Agent-Systems mit Morpheus als
Dispatcher und fünf spezialisierten Sub-Agents.

**Das Dashboard erfüllt drei Hauptfunktionen:**

- Sehen – vollständige Transparenz: wer sind die Agents, was wissen sie,
  was tun sie gerade, was haben sie bisher getan

- Verstehen – Wissens- und Konfigurationsdateien direkt einsehbar
  (SOUL.md, AGENTS.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, MEMORY.md,
  Cronjobs, Skills)

- Steuern – Dateien editieren, Cronjobs manuell triggern, Konfiguration
  ändern, Alerts verwalten

> *Primäres Ziel: Kein SSH-Zugriff auf den Server mehr nötig, um den
> Zustand und das Verhalten aller Agents zu überblicken und anzupassen.*

**1 · System-Kontext & Agent-Roster**

**1.1 Das Multi-Agent-System**

Das OpenClaw-System läuft auf einem dedizierten Server
(Morpheus-Server). OpenClaw ist ein Open-Source AI-Agent-Framework, das
Agents über Messaging-Kanäle (Slack, Telegram, WhatsApp, Discord)
zugänglich macht und ihnen Werkzeuge gibt: Shell-Zugriff, Browser,
Datei-System, Kalender, E-Mail, APIs. Jeder Agent hat ein vollständig
isoliertes Workspace-Verzeichnis mit eigenen Konfigurationsdateien,
Speicher und Session-Store.

**Architekturprinzip (OpenClaw intern):**

- Der Gateway-Prozess läuft auf Port 18789 und routet eingehende
  Nachrichten an den richtigen Agent

- Jeder Agent liest beim Start seine Workspace-Dateien und baut daraus
  seinen System-Prompt

- Sessions werden unter ~/.openclaw/agents/\<agentId\>/sessions
  gespeichert

- Heartbeats (alle ~30 Minuten) lassen Agents proaktiv ihre
  Memory-Dateien neu einlesen und geplante Tasks ausführen

- Inter-Agent-Kommunikation erfolgt über comms/inboxes/ und
  comms/outboxes/ im geteilten Workspace

**1.2 Agent-Roster: Morpheus & seine Sub-Agents**

| **Agent**         | **Rolle**               | **Primärmodell**               | **Workspace-Pfad**                                     | **Kanal-Binding**     |
|-------------------|-------------------------|--------------------------------|--------------------------------------------------------|-----------------------|
| Morpheus          | Dispatcher / Chef       | Claude Opus (Fallback: GPT-4o) | ~/.openclaw/workspace/agents-workspaces/morpheus/      | Alle Kanäle (default) |
| UX-Agent          | UX & Design             | Claude Sonnet                  | ~/.openclaw/workspace/agents-workspaces/ux/            | Slack \#ux-agent      |
| Code-Agent        | Software-Entwicklung    | Claude Sonnet / Opus           | ~/.openclaw/workspace/agents-workspaces/coding/        | Slack \#code-agent    |
| Sekretariat-Agent | Organisation & Kalender | Claude Sonnet                  | ~/.openclaw/workspace/agents-workspaces/sekretariat/   | Telegram DM           |
| Komm-Agent        | Kommunikation & PR      | Claude Sonnet                  | ~/.openclaw/workspace/agents-workspaces/kommunikation/ | Slack \#komm-agent    |
| Redaktions-Agent  | Content & Redaktion     | Claude Sonnet                  | ~/.openclaw/workspace/agents-workspaces/redaktion/     | Slack \#redaktion     |

> *Morpheus ist der Default-Agent und Dispatcher. Er empfängt alle
> eingehenden Anfragen, entscheidet welcher Sub-Agent zuständig ist, und
> koordiniert die Ergebnisse. Die Sub-Agents operieren auf isolierten
> Workspaces mit eigenen Bindings.*

**1.3 Workspace-Dateien: Das Wissen der Agents**

Jeder Agent trägt sein gesamtes "Wissen" in Markdown-Dateien innerhalb
seines Workspace-Verzeichnisses. Diese Dateien definieren
Persönlichkeit, Verhalten, Wissen und Erinnerung:

- **Persönlichkeit & Tonalität:** SOUL.md

  - Wer ist der Agent? Wie kommuniziert er? Welche Werte hat er? Welche
    Grenzen?

  - Wird jede Session geladen und bestimmt den grundlegenden Charakter
    des Agents

- **Betriebsregeln & Verhalten:** AGENTS.md

  - Memory-Management-Regeln, Sicherheitsregeln, wann sprechen vs.
    schweigen

  - Prioritäten, Workflow-Anweisungen, Tool-Nutzungs-Richtlinien

- **Agent-spezifische Rolle:** IDENTITY.md

  - Konkrete Fachspezialisierung, Zuständigkeiten, Eskalationspfade

- **Wissen über den Nutzer:** USER.md

  - Name, Zeitzone, Kommunikationspräferenzen, laufende Projekte

- **Verfügbare Werkzeuge:** TOOLS.md

  - Welche Tools darf/soll dieser Agent nutzen? Mit welchen Parametern?

- **Geplante autonome Aktionen:** HEARTBEAT.md

  - Was prüft der Agent bei jedem Heartbeat? Welche Cronjobs laufen? Mit
    welchem Schedule?

- **Langzeit-Gedächtnis:** MEMORY.md

  - Kurierte Erinnerungen, die der Agent über alle Sessions hinweg
    beibehält

- **Tages-Protokolle:** memory/YYYY-MM-DD.md

  - Automatisch vom Agent geschriebene Tagesprotokolle: Was passierte?
    Was wurde entschieden?

- **Initialisierungs-Skript:** BOOTSTRAP.md

  - Anweisungen für den ersten Start, Identitätserstellung

> *Das Dashboard muss alle diese Dateien lesbar und editierbar machen –
> ohne SSH-Zugriff. Änderungen werden beim nächsten Heartbeat des Agents
> wirksam.*

**2 · Dashboard-Module: Vollständige Funktionsbeschreibung**

Das Dashboard besteht aus den folgenden Hauptmodulen. Alle Module müssen
vollständig implementiert sein. Die Reihenfolge gibt keine Priorität an
– beginne mit dem Backend-API-Layer (Abschnitt 3), dann UI.

| **Modul / View**           | **Kernfunktion**                                                                   | **Technische Anforderung**                                         |
|----------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| Fleet Overview             | Status-Karten aller Agents, Heartbeat, Uptime                                      | REST-Polling /api/agents/status alle 30s                           |
| Agent Inspector            | SOUL.md, AGENTS.md, TOOLS.md, IDENTITY.md, USER.md, HEARTBEAT.md lesen + editieren | GET/POST /api/agents/:id/workspace-file                            |
| Live Activity Feed         | Chronologischer Ereignisstrom: Check-ins, Tasks, Fehler, @mentions                 | SSE oder Long-Polling /api/events/stream                           |
| Kanban Board               | Tasks nach Status: Backlog / In Progress / Review / Done                           | TASKS.json über REST; drag-and-drop UI                             |
| CronJob Manager            | Geplante Heartbeats & Cronjobs aller Agents anzeigen, pausieren, auslösen          | Read HEARTBEAT.md + cron config; POST /api/agents/:id/cron/trigger |
| Memory & Knowledge Browser | memory/YYYY-MM-DD.md + MEMORY.md lesen, durchsuchen                                | GET /api/agents/:id/memory, Volltextsuche                          |
| Session History            | Vergangene Sessions nach Agent: Datum, Prompt-Anzahl, Tools genutzt                | ~/.openclaw/agents/:id/sessions lesen                              |
| Config Editor              | openclaw.json + agents.list\[\].tools, models, bindings editieren                  | GET/PUT /api/config; Validierung vor Speichern                     |
| Cost Monitor               | Token-Verbrauch & API-Kosten pro Agent & Zeitraum                                  | Anthropic/OpenAI Usage-API oder Log-Aggregation                    |
| Inter-Agent Comms          | comms/inboxes/, comms/outboxes/ + broadcast.md einsehen                            | File-System read via Backend                                       |
| Skill Registry             | skills/ aller Agents: installierte Skills, SKILL.md-Preview                        | GET /api/agents/:id/skills                                         |
| Alert Center               | Fehler, Missed Heartbeats, Cost Spikes, Policy-Violations                          | Rule-Engine + E-Mail/Webhook Notify                                |

**2.1 Fleet Overview – Die Kommandozentrale**

Die Startseite / Hauptansicht des Dashboards. Zeigt alle Agents als
Karten im Grid-Layout.

**Agent-Status-Karte (pro Agent)**

- Avatar / Icon mit Agent-Name und Emoji (z.B. 🧠 Morpheus, 🎨 UX-Agent)

- Online-Indikator: grün = aktiv (Heartbeat \< 35 min), gelb = idle (\<
  2h), rot = offline

- Aktueller Status: "Bearbeitet Task: ...", "Heartbeat-Scan", "Idle",
  "Fehler: ..."

- Letzter Heartbeat: Zeitstempel + relative Zeit ("vor 12 Minuten")

- Modell: Welches LLM ist aktiv (Claude Opus 4, Sonnet 4.6, etc.)

- Quick-Stats: Sessions heute / Tasks offen / Memory-Einträge

- "Inspect"-Button → öffnet Agent Inspector (Modul 2.2)

**Dashboard-Header**

- Systemweite Gesundheitsanzeige: "6/6 Agents online" mit Farbindikator

- Letzte Systemaktivität: Zeitstempel der letzten Aktion im gesamten
  System

- Morpheus-Sonderstellung: Größere Karte oben, als Chef hervorgehoben

> *Polling-Intervall: 30 Sekunden. Der Heartbeat-Cycle von OpenClaw ist
> ~30 Minuten – das Dashboard soll aber zwischen den Heartbeats trotzdem
> aktuell bleiben, indem es die Session-Logs liest.*

**2.2 Agent Inspector – Das Gehirn eines Agents öffnen**

Detailansicht für jeden einzelnen Agent. Wird über den "Inspect"-Button
oder die Seitennavigation geöffnet. Links: Sidebar mit Tabs, rechts:
Content-Area.

**Tabs im Agent Inspector**

- SOUL – SOUL.md anzeigen & editieren. Markdown-Editor mit
  Syntax-Highlighting (z.B. CodeMirror oder Monaco). Save-Button mit
  Bestätigungsdialog.

- RULES – AGENTS.md anzeigen & editieren. Gleicher Editor.

- IDENTITY – IDENTITY.md lesen & editieren.

- USER – USER.md lesen & editieren (Wissen des Agents über den Nutzer).

- TOOLS – TOOLS.md lesen. Zeige installierte Tools in strukturierter
  Liste. Read-only mit Edit-Option.

- CRONJOBS – HEARTBEAT.md lesen + geparste Cron-Schedule-Tabelle. Zeige:
  Job-Name, Schedule (cron expression), letzter Lauf, nächster Lauf,
  Status. Buttons: "Jetzt ausführen", "Pausieren".

- SKILLS – Liste aller installierten Skills aus dem skills/-Verzeichnis
  des Agents. Pro Skill: Name, Beschreibung (aus SKILL.md),
  aktiviert/deaktiviert.

- MEMORY – Zweistufig: (1) MEMORY.md (Langzeit-Gedächtnis), (2)
  Daily-Logs als Accordion: 30 neueste Tage, auf-/zugeklappt.
  Volltextsuche über alle Memory-Einträge.

- CONFIG – openclaw.json-Eintrag dieses Agents: Modell, Fallback-Chain,
  Tool-Allow/Deny-Liste, Binding. Formular-basiert editierbar +
  Raw-JSON-View.

> *KRITISCH: Vor jedem Speichern wird ein automatisches Backup der Datei
> erstellt (z.B. SOUL.md.backup.2026-03-07T14-23-00). Das Dashboard
> zeigt die letzten 5 Backups an und erlaubt Restore.*

**2.3 Live Activity Feed – Was passiert gerade?**

Echtzeit-Stream aller Ereignisse im System. Implementiert via
Server-Sent Events (SSE) oder Polling alle 5 Sekunden.

**Ereignis-Typen**

- 🟢 Heartbeat: "Morpheus hat Heartbeat-Scan durchgeführt (14:32)"

- 📋 Task erstellt: "UX-Agent hat Task 'Wireframe für Login' erstellt"

- ✅ Task abgeschlossen: "Code-Agent hat Task \#42 abgeschlossen (Dauer:
  8 min)"

- 📨 Inter-Agent-Nachricht: "Morpheus → Code-Agent: Bitte Fix für Bug
  \#7 implementieren"

- ⚠️ Warnung: "Redaktions-Agent: Heartbeat seit 45 Minuten ausgeblieben"

- ❌ Fehler: "Sekretariat-Agent: Tool exec fehlgeschlagen – Permission
  denied"

- 💾 Memory-Update: "UX-Agent hat MEMORY.md aktualisiert"

- 🔧 Config-Änderung: "Morpheus SOUL.md wurde via Dashboard editiert"

**Filter & Darstellung**

- Filter nach Agent (Checkbox-Gruppe), nach Ereignistyp, nach Zeitraum

- Chronologischer Stream, neueste oben, mit absolutem + relativem
  Zeitstempel

- Klick auf Ereignis → öffnet Kontext (z.B. die betroffene Task,
  Session, Datei)

- "Live"-Toggle: Automatisches Scroll-Follow oder fixierter View

**2.4 Kanban Board – Aufgaben im Überblick**

Zeigt den Inhalt von TASKS.json im Kanban-Layout. Tasks können von
Morpheus oder Sub-Agents erstellt worden sein.

- Spalten: Backlog / In Progress / In Review / Done (entspricht
  TASKS.json-Status-Feld)

- Jede Task-Karte zeigt: Titel, zugewiesener Agent, Priorität
  (Farbcodiert), Erstellt-Datum, Tags

- Drag-and-Drop zum Verschieben zwischen Spalten → schreibt TASKS.json
  zurück

- Task-Detail auf Klick: Vollständige Beschreibung, Kommentare, History,
  RACI-Feld

- "Neue Task"-Button: Formular-basiert, mit Agent-Zuweisung und
  Priorität

- Filter: Nach Agent, nach Priorität, nach Datum

**2.5 CronJob Manager – Autonome Aktionen steuern**

OpenClaw nutzt HEARTBEAT.md für geplante autonome Aktionen. Das
Dashboard visualisiert alle Cronjobs und ermöglicht manuelle Eingriffe.

- Tabelle aller Cronjobs aller Agents: Agent, Job-Name, Schedule
  (cron-Expression + lesbare Darstellung wie "alle 30 Minuten"), Letzter
  Lauf, Nächster Lauf, Status

- "Jetzt ausführen"-Button pro Job: triggert einen manuellen
  Heartbeat-Cycle für den Agent

- "Pausieren/Aktivieren"-Toggle: schreibt in HEARTBEAT.md

- Cron-Timeline-Visualisierung: Die nächsten 24 Stunden als Gantt-Chart
  – wann läuft welcher Agent?

- History: Letzte 20 Ausführungen pro Job mit Ergebnis (Erfolg/Fehler,
  Dauer)

**2.6 Memory & Knowledge Browser – Das kollektive Gedächtnis**

Zugang zu allen gespeicherten Erinnerungen und Wissenseinträgen aller
Agents.

- Agent-Selector oben: Welcher Agent wird durchsucht?

- MEMORY.md Viewer: Langzeit-Gedächtnis des Agents, editierbar

- Daily Logs: Accordion-Liste aller memory/YYYY-MM-DD.md Dateien,
  auf-/zuklappbar

- Volltextsuche: Suche über MEMORY.md + alle Daily Logs eines Agents
  oder aller Agents

- Globale Suche: SHARED_KNOWLEDGE.json durchsuchen (geteiltes Wissen
  aller Agents)

- Memory-Timeline: Wann hat der Agent welche Erinnerungen hinzugefügt?
  Kalender-View

**2.7 Session History – Was haben sie gemacht?**

Vollständige Aufzeichnung aller vergangenen Sessions aller Agents.

- Liste aller Sessions pro Agent: Datum, Dauer, Anzahl Messages, Anzahl
  Tool-Calls, Kanal (Slack/Telegram/etc.)

- Session-Detail: Vollständiger Gesprächsverlauf (User-Nachrichten +
  Agent-Antworten + Tool-Calls)

- Tool-Call-Log: Welche Tools wurden aufgerufen? Mit welchen Parametern?
  Was war das Ergebnis?

- Cross-Agent: Zeige in einem Session-Detail auch ausgelöste
  Sub-Agent-Sessions

- Export: Session als Markdown oder JSON exportieren

- Suche: Über alle Sessions aller Agents nach Stichworten suchen

**2.8 Config Editor – Das System konfigurieren**

Direktzugriff auf die zentrale openclaw.json-Konfiguration und alle
Agent-spezifischen Einstellungen.

- Gesamte openclaw.json in einem JSON-Editor (Monaco Editor empfohlen)
  mit Syntax-Validation

- Formular-basierte Editoren für häufige Einstellungen: Modell-Auswahl,
  Tool-Erlaubnisse, Kanal-Bindings

- "Validieren"-Button prüft die Config vor dem Speichern auf Konsistenz

- "Speichern & Reload" triggert openclaw gateway restart (via
  Backend-Shell-Befehl)

- Diff-View: Was hat sich seit dem letzten Save geändert?

- Backup-History: Die letzten 10 Config-Stände wiederherstellbar

**2.9 Cost Monitor – Token-Verbrauch & API-Kosten**

Transparenz über die Betriebskosten des Systems. Basiert auf
API-Usage-Daten (Anthropic/OpenAI Usage-API oder lokaler
Log-Aggregation).

- Gesamtkosten der letzten 7 / 30 Tage als prominente Kennzahl

- Aufschlüsselung nach Agent: Welcher Agent verursacht welche Kosten?

- Aufschlüsselung nach Modell: Opus vs. Sonnet vs. lokale Modelle

- Zeitreihen-Chart: Tageskosten der letzten 30 Tage

- Token-Effizienz: Input-Tokens vs. Output-Tokens pro Agent

- Alert-Schwellwert: Benachrichtigung wenn Tageskosten \> X €

- Prognose: Hochrechnung auf Monatsende basierend auf aktuellem Trend

> *Cost-Monitoring reduziert laut Branchenberichten die API-Kosten um
> 30–50% durch Identifikation ineffizienter Prompts und
> überdimensionierter Heartbeat-Frequenzen.*

**2.10 Alert Center – Probleme früh erkennen**

- Alert-Typen: Missed Heartbeat (\> 35 min), Cost Spike (\> 150%
  Tagesdurchschnitt), Tool-Fehler (\> 3 Fehler/Stunde),
  Policy-Verletzung, Config-Fehler

- Alert-Liste: Alle aktiven und historischen Alerts chronologisch

- Alert-Detail: Was ist passiert? Welcher Agent? Was ist zu tun?

- Konfiguration: Schwellwerte pro Alert-Typ einstellen,
  Benachrichtigungskanal wählen (E-Mail, Slack, Webhook)

- "Quittieren"-Button: Alert als "acknowledged" markieren

**2.11 Inter-Agent Communication – Was reden die Agents miteinander?**

- Inbox/Outbox-Viewer für jeden Agent: Inhalt von
  comms/inboxes/\<agent\>.md und comms/outboxes/\<agent\>.md

- broadcast.md des geteilten Workspace: Systemweite Ankündigungen von
  Morpheus

- Message-Timeline: Chronologischer Fluss aller Inter-Agent-Nachrichten
  als Swim-Lane-Diagramm

- Filter: Nur Morpheus-Dispatches, nur Sub-Agent-Berichte, nur
  Fehler-Meldungen

**3 · Technische Architektur**

**3.1 Stack**

- Frontend: Next.js 15 (App Router) oder React 18 SPA mit Vite – deiner
  Wahl überlassen, Next.js bevorzugt wegen SSR und API Routes

- Backend: Next.js API Routes (oder separater Express/Fastify-Server) –
  läuft auf dem Morpheus-Server

- Styling: Tailwind CSS + shadcn/ui Komponenten

- Code-Editor-Komponente: Monaco Editor (VS Code Engine) für Markdown
  und JSON

- Charts: Recharts oder Chart.js

- Drag-and-Drop (Kanban): dnd-kit oder react-beautiful-dnd

- Echtzeit: Server-Sent Events (SSE) für Activity Feed

- Auth: Einfaches API-Key oder Session-basiertes Auth – das Dashboard
  ist intern, kein öffentlicher Zugang

**3.2 Backend-API: Vollständige Endpunkt-Spezifikation**

| **Method** | **Endpoint**                   | **Beschreibung**              | **Payload / Response**                               |
|------------|--------------------------------|-------------------------------|------------------------------------------------------|
| GET        | /api/agents                    | Alle Agents auflisten         | agents\[\]: {id, name, status, model, lastHeartbeat} |
| GET        | /api/agents/:id/status         | Live-Status eines Agents      | {online, activeSession, currentTask, uptime}         |
| GET        | /api/agents/:id/workspace-file | Workspace-Datei lesen         | ?file=SOUL.md → {content: string}                    |
| POST       | /api/agents/:id/workspace-file | Workspace-Datei speichern     | {file, content} → {saved: true, backupPath}          |
| GET        | /api/agents/:id/sessions       | Session-History               | \[{sessionId, date, messages, toolCalls}\]           |
| GET        | /api/agents/:id/memory         | Memory-Dateien lesen          | {daily: \[...\], longterm: string}                   |
| GET        | /api/agents/:id/skills         | Skills auflisten              | \[{name, description, enabled}\]                     |
| GET        | /api/agents/:id/cronjobs       | Cron-Konfiguration            | \[{name, schedule, lastRun, nextRun}\]               |
| POST       | /api/agents/:id/cron/trigger   | Cronjob manuell auslösen      | {jobName} → {triggered: true}                        |
| GET        | /api/events/stream             | Live-Event-Stream (SSE)       | EventSource: {type, agentId, message, ts}            |
| GET        | /api/cost/summary              | Token-Kosten Übersicht        | ?period=7d → {byAgent: {...}, total: \$}             |
| GET        | /api/config                    | Gesamte openclaw.json         | JSON-Objekt                                          |
| PUT        | /api/config                    | Config speichern + validieren | {config} → {valid, reloadRequired}                   |

> *Das Backend läuft auf demselben Server wie OpenClaw und hat direkten
> Dateisystem-Zugriff auf ~/.openclaw/. Es muss KEINE OpenClaw-API
> aufrufen – es liest/schreibt direkt die Dateien. Der OpenClaw
> Gateway-Prozess muss nach Config-Änderungen ggf. neugestartet werden:
> exec('openclaw gateway restart').*

**3.3 Datei-System-Zugriff**

Das Backend liest und schreibt folgende Pfade direkt:

- ~/.openclaw/openclaw.json – Zentrale Konfiguration (Agents, Kanäle,
  Modelle)

- ~/.openclaw/workspace/agents-workspaces/\<agentId\>/ –
  Workspace-Dateien jedes Agents

- ~/.openclaw/workspace/TASKS.json – Systemweites Task-Tracking

- ~/.openclaw/workspace/comms/ – Inter-Agent-Kommunikationsordner

- ~/.openclaw/workspace/SHARED_KNOWLEDGE.json – Gemeinsames Wissen

- ~/.openclaw/agents/\<agentId\>/sessions/ – Session-History-Dateien

- ~/.openclaw/workspace/agents-workspaces/\<agentId\>/memory/ – Daily
  Memory Logs

> *Sicherheit: Das Backend validiert alle Dateipfade
> (Path-Traversal-Schutz). Nur Dateien innerhalb der definierten
> Basis-Pfade dürfen gelesen/geschrieben werden.*

**3.4 Integration in die bestehende Website**

- Das Dashboard wird als eigenständige Next.js App unter
  /mission-control oder einem Subdomain-Pfad deiner Wahl integriert

- Sofern die bestehende Website ebenfalls Next.js ist: shared layout,
  gemeinsame Navigation möglich

- Alternativ: Eigenständige React SPA, die als statischer Build auf dem
  Server ausgeliefert wird

- Nginx-Konfiguration: /mission-control → Proxy zu Next.js auf Port 3001

- Das Dashboard-Backend läuft als separater Prozess (pm2 manage: pm2
  start npm --name mission-control -- run start)

**4 · UI/UX Design-Vorgaben**

**4.1 Design-Prinzipien**

- Aesthetic: Dark-themed Mission Control – dunkel, professionell,
  technisch. Denk NASA-Kontrollraum oder Datadog. Kein buntes
  Consumer-Look.

- Farbschema: Primär Dunkelblau (#0F172A Hintergrund, \#1E3A5F Karten),
  Akzent Cyan (#06B6D4) für Live-Elemente, Grün/Gelb/Rot für Status

- Typografie: Monospace für Code/Logs (JetBrains Mono), Sans-Serif für
  UI (Inter)

- Layout: Sidebar-Navigation links (Agent-Liste), Hauptbereich rechts,
  Header mit System-Status

- Dichte: Informationsdicht wie Monitoring-Tools – kein
  Whitespace-Luxus, aber übersichtlich

**4.2 Navigation**

- Sidebar: Alle 6 Agents als klickbare Einträge mit Status-Indikator

- Top-Level-Navigation: Fleet Overview, Activity Feed, Kanban, Cost
  Monitor, Alert Center, Config

- Breadcrumb: Morpheus \> Agent Inspector \> UX-Agent \> SOUL.md

- Keyboard-Shortcuts: Cmd+K für Quick-Search über alle Agents und
  Inhalte

**4.3 Responsive**

Das Dashboard ist primär für Desktop-Browser ausgelegt (1440px+).
Mobile-View ist optional aber nicht Pflicht für die erste Version.

**4.4 Echtzeit-Feedback**

- Live-Puls-Animation auf aktiven Agent-Karten (CSS-Animation, kein SVG
  notwendig)

- Toast-Benachrichtigungen für: erfolgreiches Speichern, Cronjob
  getriggert, Alert ausgelöst

- Loading-States für alle async API-Calls

**5 · Implementierungsplan (Reihenfolge für den Agent)**

> *Gib dem Agent diese Reihenfolge explizit vor. Komplexe Systeme
> scheitern, wenn mit dem UI begonnen wird. Backend-First.*

**Phase 1: Projekt-Setup & Backend-Foundation**

- Next.js-Projekt initialisieren (npx create-next-app@latest
  mission-control --typescript --tailwind --app)

- Ordnerstruktur: /app (Pages), /app/api (API Routes), /lib
  (Datei-System-Helpers), /components, /types

- Typen definieren: Agent, WorkspaceFile, Session, Task, CronJob, Alert,
  Event in /types/index.ts

- File-System-Helper-Klasse in /lib/openclaw-fs.ts: readWorkspaceFile(),
  writeWorkspaceFile(), listSessions(), readMemory(), readConfig(),
  writeConfig()

- Alle API-Endpunkte aus Tabelle 3.2 implementieren – zunächst mit
  Mock-Daten, dann echte FS-Zugriffe

- Auth-Middleware: API-Key-Check für alle /api/-Routen

**Phase 2: Fleet Overview & Agent Inspector**

- Fleet Overview Seite: Agent-Karten-Grid, Status-Polling,
  Heartbeat-Indikator

- Agent Inspector: Tab-Navigation, Monaco-Editor-Integration für alle
  Workspace-Dateien

- Save-Logik mit Backup-Mechanismus implementieren

- CronJob-Tab: HEARTBEAT.md parsen, Tabelle rendern, Trigger-Button

**Phase 3: Live Activity Feed & Session History**

- SSE-Endpoint /api/events/stream implementieren: polling der
  Session-Logs und Memory-Updates

- Activity Feed Komponente: Event-Stream, Filter, Auto-Scroll

- Session History: Liste + Detail-View mit Tool-Call-Log

**Phase 4: Kanban, Cost Monitor, Alert Center**

- Kanban Board: TASKS.json lesen/schreiben, Drag-and-Drop

- Cost Monitor: Log-Aggregation oder Anthropic Usage API einbinden,
  Charts

- Alert Center: Rule-Engine für Missed Heartbeats und Cost Spikes

**Phase 5: Memory Browser, Inter-Agent Comms, Config Editor**

- Memory Browser: Volltextsuche über alle Memory-Dateien

- Inter-Agent Communication Viewer: comms/-Ordner lesen,
  Timeline-Visualisierung

- Config Editor: Monaco für openclaw.json, Gateway-Restart-Button

**Phase 6: Polish & Integration**

- Dark-Theme finalisieren, alle Komponenten stilistisch vereinheitlichen

- Error Boundaries für alle Module

- Nginx-Konfiguration für die bestehende Website

- PM2-Prozess-Setup für Production-Betrieb

- README mit Installations- und Konfigurationsanleitung

**6 · Übergabeformat an den Agent**

Wenn du dieses Briefing an deinen OpenClaw-Morpheus-Agent oder einen
Coding-Agent übergibst, füge folgendes hinzu:

**6.1 Prompt-Struktur für den Agent**

> Du bist ein Senior Full-Stack-Entwickler. Deine Aufgabe ist es, das
> Mission Control Dashboard für unser OpenClaw Multi-Agent-System zu
> bauen.
>
> Stack: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Monaco Editor,
> Recharts. Das Briefing-Dokument (mission-control-briefing.docx)
> enthält alle Details. Lies es vollständig bevor du beginnst.
>
> Beginne mit Phase 1 (Projekt-Setup). Erstelle alle Dateien und erkläre
> was du tust. Frage nach jedem Phase-Abschluss bevor du zur nächsten
> Phase übergehst.

**6.2 Kontext-Variablen die du vor Übergabe befüllen musst**

- Server-Pfad zu ~/.openclaw/ (Standard oder abweichend?)

- Bestehende Website-URL und ob sie Next.js ist (für Integration)

- Wunsch-Port für das Dashboard (Standard: 3001)

- Auth-Mechanismus: API-Key (empfohlen) oder integriertes Auth der
  bestehenden Website

- Benachrichtigungs-E-Mail für Alerts

- Primäre Zeitzone des Systems

> *Empfehlung: Starte mit einem Staging-Test auf einem separaten Port,
> bevor du das Dashboard in die produktive Website integrierst. Der
> Gateway-Restart-Befehl unterbricht kurz alle Agent-Verbindungen.*

**7 · Glossar & Referenzen**

**OpenClaw-Terminologie**

- **Der OpenClaw-Kernprozess, der auf Port 18789 läuft und alle
  Nachrichten routet:** Gateway

- **Eine isolierte KI-Instanz mit eigenem Workspace, Speicher und
  Session-Store:** Agent

- **Das Verzeichnis mit den Markdown-Dateien, die den Agent
  definieren:** Workspace

- **Autonomer Zyklus (~30 min), in dem der Agent seine Dateien neu liest
  und geplante Aufgaben ausführt:** Heartbeat

- **Ein einzelnes Gespräch zwischen Nutzer/System und Agent:** Session

- **Von einem Parent-Agent gespawnter temporärer Agent für eine
  spezifische Aufgabe:** Sub-Agent

- **Plugin-Mechanismus: Eine Datei (SKILL.md) die dem Agent neue
  Fähigkeiten gibt:** Skill

- **Routing-Regel: Welcher Agent antwortet auf welchen
  Kanal/Nutzer/Kontext:** Binding

**Nützliche Quellen**

- OpenClaw Docs: https://docs.openclaw.ai

- Multi-Agent Setup: https://docs.openclaw.ai/concepts/multi-agent

- Workspace-Konzept: https://docs.openclaw.ai/concepts/agent-workspace

- Mission Control Inspiration: https://github.com/crshdn/mission-control

- Dan Malone's Blog (Best Practices):
  https://www.dan-malone.com/blog/mission-control-ai-agent-squads

*Mission Control Briefing · Morpheus Agent System · März 2026*
