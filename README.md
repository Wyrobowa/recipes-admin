# Recipes List REST Api

This is a NodeJS (ExpressJS) based REST Api.

## Environment

- `PORT` - application port
- `DATABASE_URL` - PostgreSQL connection string (Neon)

## API baseline

- Current migration baseline contract: `docs/API_CONTRACT.md`

## Migrations

- Migration files live in `src/db/migrations/sql`
- Filename convention: `YYYYMMDDHHmmss_description.sql`
- Create new migration: `npm run migrate:create -- add_new_table`
- Apply pending migrations: `npm run migrate`

## Tests

- Run integration tests: `npm test`
- Tests require `DATABASE_URL`; if missing, DB integration tests are skipped.

## Deploy (Vercel)

- Serverless entrypoint: `api/index.ts`
- Rewrites config: `vercel.json` (keeps API routes at root, e.g. `/recipes`)
- Health endpoint: `GET /health`

Deploy steps:

1. Authenticate CLI: `npx vercel login`
2. Set env in Vercel project: `DATABASE_URL` (Neon connection string)
3. Deploy production: `npx vercel --prod`

## Scripts

- `npm run dev` - run app in watch mode with TypeScript.
- `npm run build` - compile TypeScript to `dist/`.
- `npm start` - run compiled app from `dist/server.js`.
