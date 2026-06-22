# LUC 2508

This repository contains a Next.js client and a NestJS API server managed with Yarn workspaces.

## Requirements

- Node.js 22.x
- Yarn 1.22.x
- Docker Desktop for the local infrastructure from `server/docker-compose.yml`
- PostgreSQL, Redis, Elasticsearch, and S3-compatible credentials for full API runtime

## Project Structure

```text
.
|-- client                 # Next.js application
|-- server
|   |-- apps/api/src       # NestJS monorepo API application
|   |-- initial-script     # Seed/import scripts
|   |-- patches            # patch-package patches
|   `-- prisma             # Prisma schema and migrations
|-- package.json           # Root Yarn workspace scripts
`-- yarn.lock              # Single lockfile for all workspaces
```

## Fresh Environment Setup

1. Install Yarn if it is not available.

```bash
npm install --global yarn
```

2. Install all workspace dependencies from the repository root.

```bash
yarn install
```

3. Apply the local package patches.

```bash
yarn patch:packages
```

4. Generate the Prisma client.

```bash
yarn workspace ecsite generate
```

5. Configure environment variables.

Local development env files are prepared for Docker-backed local runs:

- `server/.env`
- `server/.env.docker`
- `client/.env.local`

Use real provider credentials for production-only services such as S3, GHN, VNPAY, and Resend before testing those integrations.

6. Start the local infrastructure.

```bash
cd server
docker-compose up -d
cd ..
```

7. Apply database migrations to the local PostgreSQL container.

```bash
yarn workspace ecsite migrate:prod
```

8. Build both applications.

```bash
yarn build
```

## Development Commands

Run the client:

```bash
yarn dev:client
```

Run the API:

```bash
yarn dev:server
```

Build individually:

```bash
yarn build:client
yarn build:server
```

Format all source files:

```bash
yarn format
```

Run server database tasks:

```bash
yarn workspace ecsite migrate
yarn workspace ecsite seed
```

## Code Style

- Use Yarn only. Do not commit `package-lock.json`.
- Use single quotes.
- Do not use semicolons.
- Keep comments in English.
- Use kebab-case for source file and folder names.
- Prefer TypeScript path aliases for shared imports.
- The API server uses NestJS monorepo layout with the `api` application under `server/apps/api`.

## Verification

The current setup was verified with:

```bash
yarn install
yarn patch:packages
yarn workspace ecsite generate
yarn workspace ecsite migrate:prod
docker-compose up -d
yarn build:server
yarn build:client
```

The compiled API was also smoke-tested with `GET http://localhost:3000/health` against the Docker services.
