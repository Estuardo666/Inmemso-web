import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function fixMissingColumns() {
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
    console.log('✓ Conectado a la base de datos\n')

    // 1. Create site_settings table
    console.log('📝 Creando tabla site_settings...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "primary_color" varchar DEFAULT '#1a1a1a',
        "updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)

    // 2. Add featured_image_id to services if it doesn't exist
    console.log('📝 Agregando featured_image_id a services...')
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'services' 
          AND column_name = 'featured_image_id'
        ) THEN
          ALTER TABLE "services" 
          ADD COLUMN "featured_image_id" uuid;
        END IF;
      END $$
    `)

    // 3. Add featured_image_id to projects if it doesn't exist
    console.log('📝 Agregando featured_image_id a projects...')
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'projects' 
          AND column_name = 'featured_image_id'
        ) THEN
          ALTER TABLE "projects" 
          ADD COLUMN "featured_image_id" uuid;
        END IF;
      END $$
    `)

    // 4. Add foreign keys
    console.log('📝 Agregando foreign keys...')
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'services_featured_image_fk'
        ) THEN
          ALTER TABLE "services" 
          ADD CONSTRAINT "services_featured_image_fk" 
          FOREIGN KEY ("featured_image_id") REFERENCES "media"("id") 
          ON DELETE SET NULL ON UPDATE no action;
        END IF;
      END $$
    `)

    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'projects_featured_image_fk'
        ) THEN
          ALTER TABLE "projects" 
          ADD CONSTRAINT "projects_featured_image_fk" 
          FOREIGN KEY ("featured_image_id") REFERENCES "media"("id") 
          ON DELETE SET NULL ON UPDATE no action;
        END IF;
      END $$
    `)

    console.log('\n✅ Schema corregido exitosamente')

  } catch (err) {
    console.error('❌ Error:', (err as any).message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixMissingColumns()
