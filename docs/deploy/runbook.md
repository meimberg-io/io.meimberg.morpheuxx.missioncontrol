# Mission Control — Deploy Runbook

Sprint-1 manual deploy on the OpenClaw host.
Traefik is the reverse proxy; TLS via Let's Encrypt.

---

## Architecture

```
Internet
  └─ Traefik (host)
       ├─ mission-control-dev.morpheuxx.meimberg.io  → missioncontrol-dev container
       └─ mission-control.morpheuxx.meimberg.io      → missioncontrol-prod container
```

Both stacks share the external Docker network `traefik`.
Containers never expose ports directly — Traefik routes exclusively.

---

## Prerequisites (once per host)

1. Traefik is running with:
   - entrypoint `websecure` on port 443
   - Let's Encrypt resolver named `letsencrypt`
   - Docker provider with `exposedByDefault: false`
2. External Docker network exists:
   ```sh
   docker network create traefik
   ```
3. `deploy/` directory mirrored on the server (e.g. `/opt/missioncontrol/deploy/`).
4. Env files created from templates:
   ```sh
   cp deploy/env.dev.example deploy/.env.dev
   cp deploy/env.prod.example deploy/.env.prod
   # Edit each file and fill in any secrets
   ```

---

## Local build

```sh
# Install deps and check the build compiles cleanly
pnpm install
pnpm lint
pnpm build

# Build the Docker image (tag for target env)
docker build -t missioncontrol:dev .
docker build -t missioncontrol:prod .
```

---

## First deploy — dev

```sh
cd /opt/missioncontrol

# Start the stack (detached)
docker compose -f deploy/docker-compose.dev.yml -p missioncontrol-dev up -d

# Check it's running
docker compose -f deploy/docker-compose.dev.yml -p missioncontrol-dev ps
docker compose -f deploy/docker-compose.dev.yml -p missioncontrol-dev logs -f
```

Visit: https://mission-control-dev.morpheuxx.meimberg.io

---

## First deploy — prod

```sh
cd /opt/missioncontrol

docker compose -f deploy/docker-compose.prod.yml -p missioncontrol-prod up -d

docker compose -f deploy/docker-compose.prod.yml -p missioncontrol-prod ps
docker compose -f deploy/docker-compose.prod.yml -p missioncontrol-prod logs -f
```

Visit: https://mission-control.morpheuxx.meimberg.io

---

## Update procedure

1. Pull / copy new code to the server.
2. Rebuild the image:
   ```sh
   docker build -t missioncontrol:dev .   # or :prod
   ```
3. Restart the stack (zero-downtime on single-container stacks is just a fast restart):
   ```sh
   docker compose -f deploy/docker-compose.dev.yml -p missioncontrol-dev up -d --force-recreate
   ```
4. Verify logs, then remove the old image if desired:
   ```sh
   docker image prune -f
   ```

---

## Rollback

1. Re-tag a previously saved image:
   ```sh
   docker tag missioncontrol:dev-prev missioncontrol:dev
   ```
   Or rebuild from the previous Git commit:
   ```sh
   git checkout <previous-sha>
   docker build -t missioncontrol:dev .
   ```
2. Restart the stack as per the update procedure above.

### Saving a rollback image before an update (optional but recommended)

```sh
docker tag missioncontrol:dev missioncontrol:dev-prev
```

---

## Stopping a stack

```sh
docker compose -f deploy/docker-compose.dev.yml -p missioncontrol-dev down
```

---

## Traefik label reference

| Label | Purpose |
|---|---|
| `traefik.enable=true` | Opt this container in to Traefik routing |
| `traefik.http.routers.<name>.rule` | Hostname match rule |
| `traefik.http.routers.<name>.entrypoints=websecure` | HTTPS only |
| `traefik.http.routers.<name>.tls.certresolver=letsencrypt` | Auto TLS cert |
| `traefik.http.services.<name>.loadbalancer.server.port=3000` | Container port |

---

## Notes

- Auth/middleware (Basic Auth or similar) will be added in MICO-9 as additional Traefik middleware labels.
- Dev and prod are isolated compose projects (`-p` flag) so service names never collide.
- The app is stateless in Sprint 1; no volumes are needed.
