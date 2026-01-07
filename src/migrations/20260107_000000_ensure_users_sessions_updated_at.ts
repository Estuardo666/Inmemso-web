import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration to ensure users_sessions table has updated_at column with proper constraints.
 * This handles:
 * - Adding updated_at if missing
 * - Setting NOT NULL constraint
 * - Setting DEFAULT NOW()
 * - Updating any NULL values in existing rows
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- Check if the column exists
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_sessions' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
      ) THEN
        -- Column doesn't exist, add it with DEFAULT NOW() and NOT NULL
        ALTER TABLE "public"."users_sessions" 
        ADD COLUMN "updated_at" timestamp(3) with time zone DEFAULT NOW() NOT NULL;
      ELSE
        -- Column exists, ensure it's NOT NULL with DEFAULT
        -- First, set any NULL values to NOW()
        UPDATE "public"."users_sessions" 
        SET "updated_at" = NOW() 
        WHERE "updated_at" IS NULL;

        -- Then add NOT NULL constraint if missing
        ALTER TABLE "public"."users_sessions" 
        ALTER COLUMN "updated_at" SET NOT NULL;

        -- Ensure DEFAULT is set
        ALTER TABLE "public"."users_sessions" 
        ALTER COLUMN "updated_at" SET DEFAULT NOW();
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
    END $$;
  `)
}
