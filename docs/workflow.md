# Mission Control Workflow

Diese Regeln beschreiben, wie wir Tickets im Mission-Control-Projekt durch Jira bewegen.

## Grundprinzip

Das Vision Briefing ist ein erster Seed, kein starres Pflichtenheft. Anforderungen dürfen sich im Projektverlauf ändern. Deshalb trennen wir sauber zwischen:

- **allgemeinem Prozess** → diese Datei
- **ticket-spezifischen Anforderungen** → Jira-Tickets

## Ticket-Status

### Open
Tickets eines Sprints starten in **Open**.

Bedeutung:
- Das Ticket gehört grundsätzlich zum Sprint.
- Es ist aber noch nicht ausreichend geschärft für die Umsetzung.

### Needs Specification
Tickets werden einzeln nach **Needs Specification** gezogen.

In diesem Status wird das Ticket gemeinsam konkretisiert:
- Ziel klären
- Scope eingrenzen
- offene Fragen sammeln
- Akzeptanzkriterien formulieren

### Ready to Implement
Ein Ticket wechselt nach **Ready to Implement**, wenn es ausreichend spezifiziert ist.

**Definition of Ready**
- Ziel ist klar beschrieben
- Scope ist abgegrenzt
- offene Fragen sind geklärt
- Akzeptanzkriterien sind vorhanden
- keine kritischen Unklarheiten blockieren die Umsetzung

### In Progress
Sobald die Umsetzung beginnt, wechselt das Ticket nach **In Progress**.

Regeln:
- Nur Tickets starten, die wirklich ready sind
- Fokus auf Abschluss statt auf zu viel Parallelisierung

### Testing
Wenn die Umsetzung abgeschlossen und irgendwo testbar ist, wechselt das Ticket nach **Testing**.

Geprüft wird:
- funktioniert die Umsetzung fachlich?
- passt sie zur Spezifikation?
- gibt es offensichtliche Bugs oder Lücken?
- ist der Stand reviewbar?

### Ready to Deploy
Wenn Testing erfolgreich war und der Stand sauber ist, wechselt das Ticket nach **Ready to Deploy**.

**Definition of Done**
- Umsetzung vollständig
- Akzeptanzkriterien erfüllt
- testbar und geprüft
- keine bekannten kritischen Blocker
- deployfähig

## Arbeitsprinzipien

### Ein Ticket nach dem anderen schärfen
Wir spezifizieren Tickets bewusst einzeln, nicht alle gleichzeitig halb. Das reduziert Streuverluste und hält Fragen konkret.

### WIP-Limit
Wir halten möglichst wenig parallel offen:
- **Needs Specification:** idealerweise 1 aktives Ticket
- **In Progress:** idealerweise 1 aktives Ticket pro aktivem Umsetzungsstrang

### Deploybarer Sprint-Fortschritt
Jeder Sprint soll möglichst einen **real deploybaren Fortschritt** liefern, nicht nur interne Vorarbeit.

## Rollen

### Oliver
- fachliche Klärung
- Priorisierung
- Review und Freigabe

### Neo
- Tickets schärfen
- Fragen stellen
- umsetzen
- testen
- deploy-ready machen
