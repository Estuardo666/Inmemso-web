import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function fixDefaults() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('✓ Conectado a la base de datos')

    // Fix updated_at default
    await client.query(`
      ALTER TABLE "users_sessions" 
      ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP
    `)
    console.log('✓ Agregado DEFAULT CURRENT_TIMESTAMP a updated_at')

    // Fix updated_at NOT NULL
    await client.query(`
      ALTER TABLE "users_sessions" 
      ALTER COLUMN "updated_at" SET NOT NULL
    `)
    console.log('✓ Agregado NOT NULL a updated_at')

    // Update any existing NULL values
    await client.query(`
      UPDATE "users_sessions" 
      SET "updated_at" = CURRENT_TIMESTAMP 
      WHERE "updated_at" IS NULL
    `)
    console.log('✓ Actualizados valores NULL a CURRENT_TIMESTAMP')

    console.log('\n✅ Defaults aplicados correctamente')

  } catch (err) {
    console.error('❌ Error:', (err as any).message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixDefaults()
