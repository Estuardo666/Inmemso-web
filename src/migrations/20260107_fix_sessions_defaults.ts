import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration to fix users_sessions defaults.
 * Ensures updated_at and expires_at have proper defaults.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- Set DEFAULT for updated_at
      ALTER TABLE "public"."users_sessions" 
      ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

      -- Ensure NOT NULL for updated_at  
      ALTER TABLE "public"."users_sessions" 
      ALTER COLUMN "updated_at" SET NOT NULL;

      -- Set any existing NULL values to CURRENT_TIMESTAMP
      UPDATE "public"."users_sessions" 
      SET "updated_at" = CURRENT_TIMESTAMP 
      WHERE "updated_at" IS NULL;

    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      ALTER TABLE "public"."users_sessions" 
      ALTER COLUMN "updated_at" DROP DEFAULT;
    END $$;
  `)
}
