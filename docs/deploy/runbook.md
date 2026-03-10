# Mission Control — Deploy Runbook

Sprint-1 manual deploy on the OpenClaw host.
Traefik is the reverse proxy; TLS via Let's Encrypt; Basic Auth via Traefik middleware (MICO-9).

---

## Architecture

```
Internet
  └─ Traefik (host)
       ├─ mission-control-dev.morpheuxx.meimberg.io  → Basic Auth → missioncontrol-dev container
       └─ mission-control.morpheuxx.meimberg.io      → Basic Auth → missioncontrol-prod container
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
5. Basic Auth credentials configured — see the section below.

---

## Access protection (Basic Auth)

MICO-9 protection is applied as a Traefik middleware. The hashed credentials are passed
to Docker Compose via the `MC_BASIC_AUTH_USERS` environment variable. **This variable is
never committed to the repo.**

### Generate a hashed password

```sh
# Requires apache2-utils (apt install apache2-utils) or httpd-tools
htpasswd -nb <username> <password>
# Example output: admin:$apr1$xxxxxxxxxxx$yyyyyyyyyyyyyyyyyyyyyyy
```

### Set MC_BASIC_AUTH_USERS before deploying

Docker Compose reads variable substitutions from the shell environment or from a `.env`
file in the current working directory (not from `deploy/.env.dev`).

**Option A — shell export (one-time or CI):**
```sh
export MC_BASIC_AUTH_USERS='admin:$apr1$xxxxxxxxxxx$yyyyyyyyyyyyyyyyyyyyyyy'
```

**Option B — `.env` file in the deploy working directory (recommended for the server):**
```sh
# /opt/missioncontrol/.env  (not committed, not inside deploy/)
MC_BASIC_AUTH_USERS=admin:$apr1$xxxxxxxxxxx$yyyyyyyyyyyyyyyyyyyyyyy
```
Note: Docker Compose `.env` files do **not** interpret `$` as a variable, so the
htpasswd output can be stored as-is (no escaping needed).

To support multiple users, comma-separate the entries:
```
MC_BASIC_AUTH_USERS=admin:$apr1$...,reader:$apr1$...
```

### Verify Basic Auth is active

After deploying, check that Traefik picked up the middleware:

```sh
# Confirm a 401 is returned without credentials
curl -I https://mission-control-dev.morpheuxx.meimberg.io

# Confirm access with credentials
curl -u admin:<password> https://mission-control-dev.morpheuxx.meimbing.io
```

Expected: `HTTP/2 401` without credentials, `HTTP/2 200` with valid credentials.

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

# Ensure MC_BASIC_AUTH_USERS is set (see "Access protection" above)

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

# Ensure MC_BASIC_AUTH_USERS is set (see "Access protection" above)

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
| `traefik.http.routers.<name>.middlewares=<name>-auth` | Attach Basic Auth middleware |
| `traefik.http.services.<name>.loadbalancer.server.port=3000` | Container port |
| `traefik.http.middlewares.<name>-auth.basicauth.users=…` | Hashed credentials (from env var) |

---

## Notes

- Basic Auth (MICO-9) is temporary. It will be replaced by Google OAuth in a later sprint.
  When that happens, `lib/auth.ts` is the intended hook for app-level route protection.
- Dev and prod are isolated compose projects (`-p` flag) so service names never collide.
- The app is stateless in Sprint 1; no volumes are needed.
