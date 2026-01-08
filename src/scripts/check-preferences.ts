import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function checkPreferencesSchema() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('❌ DATABASE_URL not set')
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()

    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'payload_preferences'
      ORDER BY ordinal_position
    `)

    console.log('PAYLOAD_PREFERENCES_TABLE:')
    for (const row of result.rows) {
      console.log(`${row.column_name}|${row.data_type}|${row.is_nullable}|${row.column_default || 'NULL'}`)
    }

  } catch (err) {
    console.error('ERROR:', (err as any).message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

checkPreferencesSchema()
