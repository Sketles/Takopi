# Scripts

This folder contains maintenance scripts for development.

## test-connections.ts
Simple script that tests:
- Postgres (via Prisma)
- Vercel Blob (via `@vercel/blob` and our helper `src/lib/blob.ts`)

Usage:
1. Install dependencies (if you haven't):
```bash
npm ci
npx playwright install
```
2. Ensure env vars are present (example in `.env`/`.env.local`):
```bash
# POSTGRES_PRISMA_URL or DATABASE_URL
# BLOB_READ_WRITE_TOKEN
```
3. Run the script:
```bash
npx tsx scripts/test-connections.ts
```

It returns exit code `0` on success, `1` if any connection failed.
