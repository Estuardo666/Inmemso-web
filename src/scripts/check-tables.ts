import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function checkTables() {
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
    console.log('✓ Conectado a la base de datos')

    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `)

    console.log('\n📋 Tablas existentes:')
    if (result.rows.length === 0) {
      console.log('⚠️  NO HAY TABLAS - Base de datos vacía')
    } else {
      result.rows.forEach(row => console.log(`  - ${row.tablename}`))
    }

    console.log(`\nTotal: ${result.rows.length} tablas`)

  } catch (err) {
    console.error('❌ Error:', (err as any).message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

checkTables()
