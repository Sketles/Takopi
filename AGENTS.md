# Repository Guidelines

## Project Structure & Modules
- `src/app`: Next.js App Router pages and API routes (auth, content, checkout, explore, profile, box).
- `src/components`, `src/features`, `src/contexts`, `src/hooks`, `src/types`: Reusable UI, domain layers, shared state, hooks, and TypeScript models.
- `prisma`: Schema, migrations, and `seed.ts` entry point; seeds also live in `scripts/seeding`.
- `public`: Static assets; prefer this for images/icons.
- `testing/e2e`: Playwright specs; config in `testing/playwright.config.ts`.
- `scripts`: Utility scripts for seeding and connection checks.

## Build, Test, and Dev Commands
- `npm run dev`: Start Next.js (Turbopack) at `http://localhost:3000`.
- `npm run build`: Generate Prisma client then create a production build.
- `npm start`: Serve the production build.
- `npm run lint`: Run ESLint with the Next.js config.
- `npm run seed:generate` | `npm run seed:manual`: Create or load sample data (see `scripts/seeding/README.md`).
- `npm run test:connections`: Validate DB/storage connectivity before E2E runs.
- `npm run test:e2e` | `npm run test:e2e:headed`: Playwright E2E suite (config in `testing/playwright.config.ts`).
- `npm run test:e2e:install`: Install Playwright browsers once per environment.

## Coding Style & Naming
- Language: TypeScript + React 19, Next.js 15, Tailwind CSS v4.
- Linting: ESLint (`eslint.config.mjs`); run `npm run lint` before PRs.
- Components/hooks: PascalCase files for components, camelCase for hooks and utilities.
- Styling: Prefer Tailwind utilities; co-locate component-specific styles with the component.
- Avoid default exports for shared utilities; keep domain folders organized under `src/features/*`.

## Testing Guidelines
- Framework: Playwright only; place specs in `testing/e2e`.
- Naming: Use descriptive `.spec.ts` filenames matching the user flow (e.g., `checkout-flow.spec.ts`).
- Environment: Ensure `.env.local` has required auth/payment settings; seed data before running specs.
- Coverage: Add at least one E2E path for new critical flows; update fixtures if UI changes break selectors.

## Commit & PR Guidelines
- Commits: Prefer concise, imperative messages (`Add checkout validation`, `Fix profile avatar upload`).
- Scope: Keep commits focused; include relevant scripts or schema changes together.
- PRs: Add a short summary, linked issue/ticket, testing notes (`npm run test:e2e`/`npm run lint`), and screenshots/GIFs for UI changes.
- Dependencies or schema changes: call out migrations, seed updates, or new environment variables in the PR description.

## Configuration & Security
- Secrets: Never commit `.env*`; use `.env.example` as the template. Update it when adding new env vars.
- Prisma: Run `npm run build` or `npm run prisma generate` after schema edits; re-run seeds if data shape changes.
- Assets: Keep large binaries out of git; prefer external storage or optimized files under `public/`.
