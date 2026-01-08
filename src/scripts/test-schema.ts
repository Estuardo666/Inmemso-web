import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function testUserCreation() {
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
    console.log('✓ Connected to database')

    // Check users_sessions table structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users_sessions'
      ORDER BY ordinal_position
    `)

    console.log('\n📋 users_sessions table structure:')
    console.table(tableInfo.rows)

    // Check if updated_at column exists and has proper constraints
    const constraintInfo = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users_sessions'
    `)

    console.log('\n📋 users_sessions constraints:')
    console.table(constraintInfo.rows)

  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

testUserCreation()
