#!/usr/bin/env node
/**
 * Removes Payload "dev push" marker (payload_migrations.batch = -1).
 * That marker triggers an interactive prompt inside @payloadcms/drizzle migrate.
 *
 * Safe to run repeatedly.
 * Requires DATABASE_URL / POSTGRES_* env vars in CI (Vercel build).
 */

import pg from 'pg'

const { Client } = pg

function getDatabaseUrlFromParts() {
  const host = process.env.PGHOST
  const user = process.env.PGUSER
  const password = process.env.PGPASSWORD
  const database = process.env.PGDATABASE
  const port = process.env.PGPORT
  const sslmode = process.env.PGSSLMODE || 'require'
  if (!host || !user || !password || !database) return undefined

  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
  const hostPort = port ? `${host}:${port}` : host
  return `postgresql://${auth}@${hostPort}/${database}?sslmode=${encodeURIComponent(sslmode)}`
}

const databaseUrl = process.env.DATABASE_URL || getDatabaseUrlFromParts()

if (!databaseUrl) {
  console.log('ℹ️  No DATABASE_URL/POSTGRES_* found; skipping dev marker cleanup.')
  process.exit(0)
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

try {
  console.log('🔧 Checking Payload dev marker (payload_migrations.batch = -1)...')
  await client.connect()

  // Ensure table exists before querying
  const existsRes = await client.query(`SELECT to_regclass('public."payload_migrations"') AS exists;`)
  const exists = existsRes?.rows?.[0]?.exists
  if (!exists) {
    console.log('ℹ️  payload_migrations table not found; skipping.')
    process.exit(0)
  }

  const countRes = await client.query('SELECT COUNT(*)::int AS c FROM "payload_migrations" WHERE batch = -1;')
  const count = countRes.rows?.[0]?.c ?? 0

  if (count > 0) {
    await client.query('UPDATE "payload_migrations" SET batch = 0 WHERE batch = -1;')
    console.log(`✅ Updated ${count} dev marker row(s) (batch -1 → 0).`)
  } else {
    console.log('✅ No dev marker rows found.')
  }
} catch (err) {
  console.warn('⚠️  Dev marker cleanup failed; continuing build.', err?.message || err)
} finally {
  try {
    await client.end()
  } catch {
    // ignore
  }
}
