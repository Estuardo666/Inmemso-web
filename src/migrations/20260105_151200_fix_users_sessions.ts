import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration to fix users_sessions table:
 * - Add missing updated_at column with DEFAULT NOW()
 * - Add DEFAULT NOW() to created_at column
 * 
 * This migration is idempotent - safe to run multiple times.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add updated_at column if it doesn't exist
  await db.execute(sql`
    DO $$
    BEGIN
      -- Check if updated_at column exists
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_sessions' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
      ) THEN
        -- Add the column with default value
        ALTER TABLE "public"."users_sessions" 
        ADD COLUMN "updated_at" timestamp(3) with time zone DEFAULT NOW() NOT NULL;
      ELSE
        -- Column exists, ensure it has the default value
        ALTER TABLE "public"."users_sessions" 
        ALTER COLUMN "updated_at" SET DEFAULT NOW();
      END IF;

      -- Ensure created_at has default value
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_sessions' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
      ) THEN
        ALTER TABLE "public"."users_sessions" 
        ALTER COLUMN "created_at" SET DEFAULT NOW();
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Remove the updated_at column if it exists
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_sessions' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
      ) THEN
        ALTER TABLE "public"."users_sessions" DROP COLUMN "updated_at";
      END IF;

      -- Remove default from created_at
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_sessions' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
      ) THEN
        ALTER TABLE "public"."users_sessions" 
        ALTER COLUMN "created_at" DROP DEFAULT;
      END IF;
    END $$;
  `)
}
