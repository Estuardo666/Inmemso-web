## Plan: Fix Neon SSL & startup

Ensure production Postgres uses SSL on Neon, stop migrations in serverless start, and add a db env checker.

### Steps
1. Review and adjust Neon/Postgres config in [payload.config.ts](payload.config.ts) so production adds SSL (`ssl: true` or `{ rejectUnauthorized: false }`) to the adapter options.
2. Confirm no migration execution runs during serverless boot in Vercel entrypoints (e.g., [app/(payload)/api/[...slug]/route.ts](app/(payload)/api/%5B...slug%5D/route.ts), [app/(payload)/layout.tsx](app/(payload)/layout.tsx)); remove/guard any automatic migration calls.
3. Document a safe manual production migration command (likely `DATABASE_URI=... npx prisma migrate deploy`) for local execution against Neon.
4. Create [src/utils/dbCheck.ts](src/utils/dbCheck.ts) that logs whether `DATABASE_URI` is defined (without printing its value) for Vercel logs.

### Further Considerations
1. Confirm which env var is canonical (`DATABASE_URI` vs `DATABASE_URL`) and align Prisma/Payload on one.
