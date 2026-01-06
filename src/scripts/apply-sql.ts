import fs from 'fs'
import path from 'path'
import { Client } from 'pg'
import dotenv from 'dotenv'

(async () => {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), 'env.local') })
    const fileArg = process.argv[2]
    if (!fileArg) {
      console.error('Usage: tsx src/scripts/apply-sql.ts <path-to-sql-file>')
      process.exit(1)
    }

    const sqlPath = path.resolve(process.cwd(), fileArg)
    if (!fs.existsSync(sqlPath)) {
      console.error(`SQL file not found: ${sqlPath}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('DATABASE_URL not set. Check env.local or environment variables.')
      process.exit(1)
    }

    const client = new Client({ connectionString: databaseUrl })
    await client.connect()
    console.log(`[apply-sql] Connected. Executing: ${sqlPath}`)
    await client.query('BEGIN;')
    await client.query(sql)
    await client.query('COMMIT;')
    await client.end()
    console.log('[apply-sql] ✅ SQL applied successfully.')
    process.exit(0)
  } catch (err: any) {
    try {
      console.error('[apply-sql] ❌ Error applying SQL:', err?.message || err)
    } catch {}
    process.exit(1)
  }
})()
