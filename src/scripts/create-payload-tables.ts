import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function createPayloadTables() {
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

    // Create payload_preferences first if it doesn't exist
    console.log('📝 Asegurando que payload_preferences existe...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_preferences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "key" varchar,
        "value" jsonb,
        "updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)

    // Create indexes for payload_preferences
    await client.query(`
      CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" ("key");
      CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" ("created_at");
    `)

    // Create payload_preferences_rels table
    console.log('📝 Creando payload_preferences_rels...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" uuid NOT NULL,
        "path" varchar NOT NULL,
        "users_id" uuid
      )
    `)

    // Create payload_locked_documents table
    console.log('📝 Creando payload_locked_documents...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
        "id" serial PRIMARY KEY NOT NULL,
        "global_slug" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `)

    // Create payload_locked_documents_rels table
    console.log('📝 Creando payload_locked_documents_rels...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "users_id" uuid,
        "projects_id" uuid,
        "services_id" uuid,
        "media_id" uuid,
        "testimonials_id" uuid
      )
    `)

    // Add foreign keys
    console.log('📝 Agregando foreign keys...')
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'payload_preferences_rels_parent_fk'
        ) THEN
          ALTER TABLE "payload_preferences_rels" 
          ADD CONSTRAINT "payload_preferences_rels_parent_fk" 
          FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") 
          ON DELETE cascade ON UPDATE no action;
        END IF;
      END $$
    `)

    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'payload_preferences_rels_users_fk'
        ) THEN
          ALTER TABLE "payload_preferences_rels" 
          ADD CONSTRAINT "payload_preferences_rels_users_fk" 
          FOREIGN KEY ("users_id") REFERENCES "users"("id") 
          ON DELETE cascade ON UPDATE no action;
        END IF;
      END $$
    `)

    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'payload_locked_documents_rels_parent_fk'
        ) THEN
          ALTER TABLE "payload_locked_documents_rels" 
          ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" 
          FOREIGN KEY ("parent_id") REFERENCES "payload_locked_documents"("id") 
          ON DELETE cascade ON UPDATE no action;
        END IF;
      END $$
    `)

    // Add indexes
    console.log('📝 Creando índices...')
    await client.query(`
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" ("order");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" ("path");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" ("users_id");
      
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" ("global_slug");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" ("created_at");
      
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" ("order");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" ("parent_id");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" ("path");
    `)

    console.log('\n✅ Tablas de Payload creadas correctamente')

  } catch (err) {
    console.error('❌ Error:', (err as any).message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

createPayloadTables()
