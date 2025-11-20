# Playwright E2E Tests

This folder contains Playwright E2E tests and a Playwright config specialized to run tests under `./testing/e2e`.

How to run:

```bash
npm install
npx playwright install
npm run test:e2e
```

Configuration files:
- `testing/playwright.config.ts`: Playwright config that points to `./testing/e2e`.
- `testing/e2e/*.spec.ts`: Tests for user flows and navigation.
The tests are arranged by features under `testing/e2e`: for example
- `testing/e2e/profile/` for profile-related tests
- `testing/e2e/navigation/` for navigation-related tests

Notes:
- The tests require environment variables for a test user (see README root) and a running dev server.
- Consider adding seeding or mocking workflows so these tests are stable in CI.
